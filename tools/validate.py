#!/usr/bin/env python3
"""Validate a skill graph (SPEC.md §8) and optionally print a prerequisite closure.

Usage:
  python3 tools/validate.py graph/security.yaml
  python3 tools/validate.py graph/security.yaml --closure zero-trust@2
"""
import argparse
import re
import sys

import yaml

LEVELS = (1, 2, 3)
SKILL_KEYS = {"id", "name", "version", "skill_path", "sha256", "specializes",
              "complements", "levels", "requires", "recommends", "expires_after"}
REQUIRED_KEYS = {"id", "name", "version", "skill_path", "levels"}
ID_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
SEMVER_RE = re.compile(r"^\d+\.\d+\.\d+$")
DURATION_RE = re.compile(r"^\d+d$")


def node(skill, level):
    return f"{skill}@{level}"


class Graph:
    def __init__(self, data):
        self.skills = {s.get("id"): s for s in data.get("skills", [])}
        self.errors, self.warnings = [], []

    def err(self, msg):
        self.errors.append(msg)

    def warn(self, msg):
        self.warnings.append(msg)

    def edges(self, skill_id, level, groups=("all", "any")):
        """Direct `requires` edges of skill@level, including the implicit self edge."""
        s = self.skills[skill_id]
        out = []
        if level > 1:
            out.append((skill_id, level - 1, "implicit"))
        for group in groups:
            for e in (s.get("requires") or {}).get(level, {}).get(group, []) or []:
                out.append((e.get("skill"), e.get("level"), group))
        return out

    # --- checks -----------------------------------------------------------

    def check_schema(self):
        seen = set()
        for s in self.skills.values():
            sid = s.get("id", "<missing id>")
            if sid in seen:
                self.err(f"{sid}: duplicate id")
            seen.add(sid)
            for k in REQUIRED_KEYS - s.keys():
                self.err(f"{sid}: missing '{k}'")
            for k in s.keys() - SKILL_KEYS:
                self.err(f"{sid}: unknown key '{k}' (closed vocabulary, SPEC §3.2)")
            if not ID_RE.match(str(sid)):
                self.err(f"{sid}: id must be kebab-case")
            if not SEMVER_RE.match(str(s.get("version", ""))):
                self.err(f"{sid}: version must be semver")
            if "expires_after" in s and not DURATION_RE.match(str(s["expires_after"])):
                self.err(f"{sid}: expires_after must look like '180d'")
            levels = s.get("levels") or {}
            if set(levels) != set(LEVELS):
                self.err(f"{sid}: levels must be exactly {LEVELS}")
            for lv, spec in levels.items():
                if not (spec or {}).get("can") or not (spec or {}).get("assessment"):
                    self.err(f"{sid}@{lv}: level needs 'can' and 'assessment'")
            for rel in ("requires", "recommends"):
                for lv in (s.get(rel) or {}):
                    if lv not in LEVELS:
                        self.err(f"{sid}: {rel} has invalid level {lv}")
            for lv, groups in (s.get("requires") or {}).items():
                for g in groups or {}:
                    if g not in ("all", "any"):
                        self.err(f"{sid}@{lv}: requires group must be 'all' or 'any', got '{g}'")
                if len((groups or {}).get("any", []) or []) == 1:
                    self.warn(f"{sid}@{lv}: 'any' with a single option; use 'all'")

    def check_references(self):
        for s in self.skills.values():
            sid = s["id"]
            for lv, groups in (s.get("requires") or {}).items():
                for g, entries in (groups or {}).items():
                    for e in entries or []:
                        self._check_ref(sid, lv, e, "requires")
                        if not str(e.get("rationale", "")).strip():
                            self.err(f"{sid}@{lv}: requires {e.get('skill')}@{e.get('level')} has no rationale")
            for lv, entries in (s.get("recommends") or {}).items():
                for e in entries or []:
                    self._check_ref(sid, lv, e, "recommends")
            for rel in ("specializes", "complements"):
                for other in s.get(rel) or []:
                    if other not in self.skills:
                        self.err(f"{sid}: {rel} unknown skill '{other}'")
                    if other == sid:
                        self.err(f"{sid}: {rel} itself")

    def _check_ref(self, sid, lv, e, rel):
        if e.get("skill") not in self.skills:
            self.err(f"{sid}@{lv}: {rel} unknown skill '{e.get('skill')}'")
        elif e.get("level") not in LEVELS:
            self.err(f"{sid}@{lv}: {rel} {e.get('skill')} invalid level {e.get('level')}")
        elif e.get("skill") == sid:
            self.err(f"{sid}@{lv}: {rel} itself (levels are implicitly cumulative)")

    def check_cycles(self):
        """No cycles over skill@level `requires` edges, nor over `specializes`."""
        WHITE, GREY, BLACK = 0, 1, 2
        color = {}

        def visit(n, path):
            color[n] = GREY
            sid, lv = n
            for dep, dlv, _ in self.edges(sid, lv):
                m = (dep, dlv)
                if color.get(m, WHITE) == GREY:
                    cyc = path[path.index(m):] + [m] if m in path else [n, m]
                    self.err("requires cycle: " + " -> ".join(node(*x) for x in cyc))
                elif color.get(m, WHITE) == WHITE:
                    visit(m, path + [m])
            color[n] = BLACK

        for sid in self.skills:
            for lv in LEVELS:
                if color.get((sid, lv), WHITE) == WHITE:
                    visit((sid, lv), [(sid, lv)])

        for sid in self.skills:
            seen, stack = set(), list(self.skills[sid].get("specializes") or [])
            while stack:
                p = stack.pop()
                if p == sid:
                    self.err(f"specializes cycle through {sid}")
                    break
                if p in seen or p not in self.skills:
                    continue
                seen.add(p)
                stack.extend(self.skills[p].get("specializes") or [])

    def check_redundancy(self):
        """Warn on `all` edges already implied by another guaranteed path."""
        for sid in self.skills:
            for lv in LEVELS:
                direct = self.edges(sid, lv, groups=("all",))
                for i, (dep, dlv, g) in enumerate(direct):
                    if g == "implicit":
                        continue
                    others = [(d, l) for j, (d, l, _) in enumerate(direct) if j != i]
                    if (dep, dlv) in self.guaranteed_closure(others):
                        self.warn(f"{sid}@{lv}: requires {dep}@{dlv} is redundant (implied transitively)")

    # --- closure ------------------------------------------------------------

    def guaranteed_closure(self, roots):
        """All skill@level reachable via `all` + implicit edges (no choices)."""
        seen, stack = set(), list(roots)
        while stack:
            n = stack.pop()
            if n in seen:
                continue
            seen.add(n)
            stack.extend((d, l) for d, l, _ in self.edges(*n, groups=("all",)))
        return seen

    def closure(self, sid, lv):
        """Topologically ordered mandatory closure plus unresolved `any` choices."""
        order, seen, choices = [], set(), []

        def visit(n):
            if n in seen:
                return
            seen.add(n)
            for d, l, _ in self.edges(*n, groups=("all",)):
                visit((d, l))
            anys = (self.skills[n[0]].get("requires") or {}).get(n[1], {}).get("any") or []
            if anys:
                choices.append((n, [(e["skill"], e["level"]) for e in anys]))
            order.append(n)

        visit((sid, lv))
        return order, choices

    def validate(self):
        self.check_schema()
        if self.errors:
            return
        self.check_references()
        if self.errors:
            return
        self.check_cycles()
        if not self.errors:
            self.check_redundancy()


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("graph")
    ap.add_argument("--closure", metavar="SKILL@LEVEL")
    args = ap.parse_args()

    with open(args.graph) as f:
        g = Graph(yaml.safe_load(f) or {})
    g.validate()

    for w in g.warnings:
        print(f"warning: {w}")
    for e in g.errors:
        print(f"error: {e}")
    if g.errors:
        print(f"FAIL: {len(g.errors)} error(s)")
        return 1
    print(f"OK: {len(g.skills)} skills, {len(g.warnings)} warning(s)")

    if args.closure:
        sid, _, lv = args.closure.partition("@")
        if sid not in g.skills or not lv.isdigit() or int(lv) not in LEVELS:
            print(f"error: unknown node {args.closure}")
            return 1
        order, choices = g.closure(sid, int(lv))
        print(f"\nProvisioning order for {args.closure}:")
        for i, n in enumerate(order, 1):
            print(f"  {i:2}. {node(*n)}")
        for n, opts in choices:
            print(f"  + {node(*n)} also needs one of: {', '.join(node(*o) for o in opts)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
