#!/usr/bin/env node
// Checks that every external link in a content file still resolves. Part of the fact-check
// step (the fact-check skill): a draft is only allowed to cite pages that exist.
//
// It is deliberately not part of a site build. The build must not depend on someone
// else's server being up, so this runs once, on a draft, before the PR.
//
// Usage:
//   node scripts/check-links.mjs --file <draft>.md
//   node scripts/check-links.mjs --file <path> --json
//
// A link is "ok" (2xx/3xx), "blocked" (401/403/429: the host answered but refuses
// scripts, so open it yourself) or "broken" (anything else, or no answer). Exit code 1
// when a link is broken, 0 otherwise. "blocked" never fails the run, but it isn't a pass:
// the skill says what to do with one.

import { readFile } from "node:fs/promises";

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};
const file = flag("--file");
const json = args.includes("--json");
if (!file) {
  console.error("usage: check-links.mjs --file <path> [--json]");
  process.exit(2);
}

// Every http(s) URL in the file, with the line it's on: markdown links, bare URLs, and
// URLs in frontmatter or yaml values, but not the ones inside fenced code. Trailing punctuation that belongs to the sentence
// rather than the URL is trimmed, as are unbalanced closing brackets.
function findLinks(text) {
  const found = new Map();
  let fenced = false;
  text.split(/\r?\n/).forEach((line, i) => {
    // Fenced code is illustration: its hosts ("https://my-company/apis") were never real.
    if (/^\s*(```|~~~)/.test(line)) return void (fenced = !fenced);
    if (fenced) return;
    for (const m of line.matchAll(/https?:\/\/[^\s<>"'`]+/g)) {
      let url = m[0].replace(/[.,;:!?*_]+$/, "");
      const count = (ch) => url.split(ch).length - 1;
      // "(see https://x.org/a)" ends on a bracket the URL never opened.
      while ((url.endsWith(")") && count(")") > count("(")) || (url.endsWith("]") && count("]") > count("["))) {
        url = url.slice(0, -1).replace(/[.,;:!?*_]+$/, "");
      }
      if (!found.has(url)) found.set(url, i + 1);
    }
  });
  return [...found].map(([url, line]) => ({ url, line }));
}

const UA = "Mozilla/5.0 (compatible; link-check)";

async function probe(url, method) {
  const res = await fetch(url, {
    method,
    redirect: "follow",
    headers: { "user-agent": UA, accept: "text/html,*/*" },
    signal: AbortSignal.timeout(15000),
  });
  // Drain nothing: the status is all that's needed.
  res.body?.cancel().catch(() => {});
  return res.status;
}

async function check({ url, line }) {
  let status;
  let error;
  try {
    status = await probe(url, "HEAD");
    // Plenty of servers answer HEAD with 404/405 and GET with 200.
    if (status >= 400) status = await probe(url, "GET");
  } catch (e) {
    try {
      status = await probe(url, "GET");
    } catch (e2) {
      error = e2.cause?.code || e2.name || String(e2);
    }
  }
  const verdict = error ? "broken" : status < 400 ? "ok" : [401, 403, 429].includes(status) ? "blocked" : "broken";
  return { url, line, status: status ?? null, error: error ?? null, verdict };
}

const links = findLinks(await readFile(file, "utf8"));
const results = [];
// A few at a time: enough to be quick, few enough not to look like a crawler.
for (let i = 0; i < links.length; i += 4) results.push(...(await Promise.all(links.slice(i, i + 4).map(check))));

if (json) {
  console.log(JSON.stringify(results, null, 2));
} else if (!results.length) {
  console.log("no external links");
} else {
  for (const r of results) console.log(`${r.verdict.padEnd(7)} ${String(r.status ?? r.error).padEnd(12)} line ${r.line}  ${r.url}`);
  const n = (v) => results.filter((r) => r.verdict === v).length;
  console.log(`\n${results.length} links: ${n("ok")} ok, ${n("blocked")} blocked, ${n("broken")} broken`);
}
process.exit(results.some((r) => r.verdict === "broken") ? 1 : 0);
