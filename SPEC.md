# Skill Graph — Spec (v0.1, draft)

An ontology-based skill graph that orchestrating agents use to **steer, provision
and spawn subagents**. Skills are nodes, prerequisites are typed edges, and agents
hold *assessed* levels in skills. An orchestrator turns a goal into required
skills, finds or spawns agents that hold them, and hands each subagent the slice
of the graph it needs to know what it can do, what it can't, and who can.

Status: concept hardened, first domain = **security / identity & access**.

---

## 1. Decisions

| # | Question | Decision |
|---|----------|----------|
| 1 | Audience | Claude Agent Skills (SKILL.md packages) used by agents, not humans |
| 2 | Enforcement | Guide by default; **block** where the harness can enforce it (§5) |
| 3 | Level evidence | Assessed by an evaluator, never self-claimed (§6) |
| 4 | v1 scope | One domain, ~12 nodes (`graph/security.yaml`) |

## 2. Goals / non-goals

**Goals**
- The orchestrator can answer: *which skills does this goal need, at what level,
  in what order, and which agents already hold them?*
- Subagents are provisioned with the **smallest sufficient** skill set and the
  knowledge of adjacent skills and agents to hand off to.
- Prerequisites are machine-checkable and every hard edge has a stated reason.

**Non-goals (v1)**
- Full OWL/RDF reasoning. The ontology is a fixed vocabulary in YAML; export to
  RDF is a later option, not a dependency.
- Human learning paths, multiple domains, UI.

## 3. Ontology

### 3.1 Entity types

| Type | Meaning |
|------|---------|
| `Skill` | A capability packaged as an Agent Skill (SKILL.md), with levels 1–3 |
| `Level` | A skill's proficiency tier; each tier carries a permission tier (§3.3) |
| `Agent` | A running or spawnable agent profile that holds skill attestations |
| `Attestation` | Signed evidence that an agent holds `skill@level` (§6) |
| `Goal` | A request the orchestrator breaks down into required `skill@level` |

### 3.2 Relations (closed vocabulary)

| Relation | From → To | Semantics | Enforced? |
|----------|-----------|-----------|-----------|
| `requires` | Skill@L → Skill@L | Hard prerequisite. `all:` = AND, `any:` = at least one | **Yes** — blocks provisioning |
| `recommends` | Skill@L → Skill@L | Soft prerequisite; orchestrator warns and ranks | No |
| `specializes` | Skill → Skill | is-a (e.g. `oauth-oidc` specializes `authn`). Holding the child at L counts as the parent at `min(L, 2)` | Used in matching |
| `complements` | Skill ↔ Skill | Often needed together; used to suggest co-provisioning or pairing agents | No |
| `holds` | Agent → Attestation | Agent's assessed level in a skill | Source of truth for matching |
| `needs` | Goal → Skill@L | Output of goal decomposition | — |

Anything outside this vocabulary is rejected by the validator. New relations go
through spec change, not ad hoc.

### 3.3 Level semantics (uniform across skills)

| Level | Meaning for an agent | Default permission tier |
|-------|---------------------|-------------------------|
| 1 — Know | Explain, review, critique | Read-only tools |
| 2 — Apply | Implement within an existing design | Read + write within scope |
| 3 — Design | Make architectural decisions, **may spawn subagents** in this skill | Read + write + delegate |

Each skill states *what* L1/L2/L3 look like concretely (`levels.*.can`) and
which assessment certifies it.

## 4. Node schema

```yaml
id: zero-trust                 # kebab-case, unique in the graph
name: Zero Trust Architecture
version: 1.0.0                 # semver; a major bump invalidates attestations
skill_path: skills/zero-trust/SKILL.md
sha256: ~                      # content pin of SKILL.md; required once the file exists
specializes: []                # optional
complements: [policy-as-code]
levels:
  1: { can: "...", assessment: eval:zt-l1 }
  2: { can: "...", assessment: eval:zt-l2 }
  3: { can: "...", assessment: eval:zt-l3 }
requires:                      # keyed by the level being unlocked
  1:
    all:
      - { skill: authz, level: 1, rationale: "..." }
  2:
    all:
      - { skill: authz, level: 2, rationale: "Per-request policy decisions are authz decisions" }
    any:
      - { skill: network-segmentation, level: 1, rationale: "..." }
      - { skill: pki-mtls,             level: 1, rationale: "..." }
recommends:
  2:
    - { skill: observability, level: 1 }
expires_after: 180d            # attestations older than this must be re-assessed
```

Rules:
- `requires.N` is cumulative: unlocking L3 also needs everything for L2 and L1.
- A skill at level N implicitly requires itself at N-1.
- Every `requires` entry **must** have a `rationale`. `recommends` may omit it.

## 5. Enforcement: guide vs block

Prompt text can only *guide*. **Blocking is only real where the harness enforces
it**, so in v1 we block at three points and guide everywhere else:

| Point | Mechanism | Mode |
|-------|-----------|------|
| **Provisioning** | The provisioner refuses to load a SKILL.md into a subagent unless the agent holds valid attestations for every `requires` edge of that level | Block |
| **Tool grant** | The subagent's allowed tools come from the permission tier of its assessed level (§3.3), not from what the skill asks for | Block |
| **Delegation** | A subagent can only spawn children with a subset of its own attestations, and only for skills where it holds L3 (attenuation, like capability tokens) | Block |
| Planning / routing | Orchestrator reads `recommends`, `complements`, missing prerequisites | Guide |

If the harness in use can't enforce a point, that point degrades to **guide**
and the orchestrator logs `enforcement: advisory` for the run. That way nobody
mistakes advisory gating for real gating.

## 6. Assessment and attestations

- An **assessor** (a separate evaluator agent plus a fixed eval suite per
  `skill@level`) produces attestations. The assessed agent never grades itself.
- An attestation is bound to:
  `{agent_profile, skill_id, skill_major_version, level, model_id, eval_id, issued_at, expires_at, assessor_sig}`.
- It becomes **invalid** when any of these happen: the skill's major version bumps,
  the model ID changes, the time is past `expires_at`, or the eval suite is
  revised as a breaking change.
- Attestations live in a registry the orchestrator reads. Agents **cannot write**
  to it, and claims in an agent's context or output are ignored.
- **Challenge path:** an agent may be assessed directly at L2/L3 without holding
  lower attestations, but only if it also passes the prerequisite assessments
  bundled into that challenge.

## 7. Orchestrator algorithm (v1)

```
plan(goal):
  needs      = decompose(goal)                 # -> [skill@level], LLM-proposed
  needs      = validate(needs, graph)          # unknown skills rejected
  closure    = prereq_closure(needs)           # all transitive `requires`
  order      = topo_sort(closure)              # build order / hand-off order
  for each skill@level in needs:
      agent = match(skill@level, registry)     # honours `specializes`, expiry
      if agent: route
      elif some agent holds L3 in skill: that agent may spawn(child)
      else: flag gap -> request assessment or human decision
spawn(child, skills):
  provision   = prereq_closure(skills) ∩ parent.attestations   # attenuation
  context     = SKILL.md for provision
              + graph slice: provision ∪ 1-hop neighbours (ids + one-line descr)
              + agent directory for those neighbours (who holds what)
  tools       = permission_tier(min level held across provision)
```

The **1-hop slice** is what gives a subagent "an understanding of how skills
relate". It knows the name of an adjacent skill it lacks and which agent holds
it, so it can hand off instead of improvising. It loads only its own SKILL.md
bodies, which keeps context small (progressive disclosure).

## 8. Validation (CI, `tools/validate.py`)

1. Schema: required fields, kebab-case IDs, semver, levels 1–3 only.
2. Vocabulary: only relations from §3.2.
3. Referential integrity: every referenced skill and level exists.
4. **No cycles** in `requires` (over `skill@level` nodes) or `specializes`.
5. Every `requires` edge has a non-empty `rationale`.
6. No redundant edges: a direct `requires` implied transitively by another is a
   warning (keeps the graph readable).
7. Reachability: every skill@1 is unlockable from the roots.

## 9. Threat model (hardening checklist)

| Threat | Mitigation |
|--------|-----------|
| Agent claims a level it doesn't hold | Registry is the only source (§6); self-claims ignored |
| Subagent escalates by spawning a more capable child | Attenuation at delegation (§5) |
| Malicious or tampered SKILL.md | Skills pinned by content hash in the graph; provisioner verifies it before loading |
| Prompt injection via skill content or neighbour descriptions | Neighbour slice is structured data (ids + one-liners), not skill bodies; skill bodies reviewed like code |
| Stale competence after model or skill change | Attestations bound to model ID and skill major version |
| Bad edge silently gates everything downstream | Mandatory `rationale`, CODEOWNERS on `graph/`, validator in CI |
| Goal decomposition hallucinates skills | `validate(needs)` rejects IDs not in graph |
| Advisory gating mistaken for enforcement | Explicit `enforcement: advisory` flag per run |

## 10. Open questions

1. **Registry location:** file in repo (simple, auditable) or a service (dynamic
   agents)? Proposal: file for v1.
2. **Assessor design:** fixed evals + LLM judge, or also human sign-off for L3?
3. **Spawn budget:** max depth and fan-out per orchestrator run.
4. **Is `specializes` credit at `min(L,2)`** the right default, or per edge?
5. **Where does blocking live** in the chosen harness (Agent SDK subagent
   definitions, tool allowlists, a provisioning hook)? This decides how much of
   §5 is real in v1.

## 11. Roadmap (AI-native SDLC)

1. **Spec** — this document + seed graph + validator ← *we are here*
2. **Plan** — pick the harness and registry format; answer §10
3. **Build** — provisioner + `prereq_closure`/`match`/slice; 3 real SKILL.md files
4. **Verify** — evals per `skill@level`; end-to-end goal "design ZT access for
   an internal API" routed through the graph
5. **Iterate** — expand the domain, then add a second domain to test cross-domain edges
