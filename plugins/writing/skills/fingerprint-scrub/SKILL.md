---
name: fingerprint-scrub
description: Run the bundled deterministic fingerprint scrub over a draft written or heavily edited by a model, and resolve what it reports — sentence rhythm, paragraph shape, punctuation rates and filler phrases, measured against the norms of my own published writing. Use on any article or long post in my voice, after the voice self-critique and before the fact-check. Agent-agnostic.
---

# Fingerprint scrub

A non-LLM pass that measures a draft against the numbers in §1 of my voice guide and the
anti-patterns in its §9. It catches what reading tends to miss (sentence rhythm, punctuation
rate, filler phrases) and works the same whichever model or provider wrote the draft.

It's a smell detector, not a gate. It never blocks a build or a PR.

The script is in `scripts/` next to this file and needs only Node 18 or later. Below, `SCRUB`
stands for `node <this skill's folder>/scripts/scrub-fingerprint.mjs`.

## 0. Use my norms

The script compares against `fingerprint-norms.json` next to my voice guide (the
`my-writing-style` skill says where the guide lives). Pass it with `--norms` on every run
below. When I write in several languages, use the norms file for the draft's language
(`fingerprint-norms.<lang>.json`).

If there's no norms file, the script falls back to defaults that suit short-paragraph,
blog-style prose. Say so in the hand-over, and offer to measure my real norms: the
`voice-guide` skill does that with `SCRUB --measure`.

## 1. Apply the safe fixes

```
SCRUB --file <draft>.md --norms <norms>.json --fix
```

`--fix` only applies the fixable tier in `scripts/lib/fingerprint-patterns.mjs`: chatbot
artifacts ("I hope this helps!") and filler substitutions ("in order to" → "to"). These
preserve meaning by construction. Frontmatter is left alone.

## 2. Read the report

```
SCRUB --file <draft>.md --norms <norms>.json
```

Add `--json` to process the findings programmatically. There are two kinds of finding, with
line numbers:

- **Smells**, measured against my norms: sentence length, paragraph shape, em-dash, emoji and
  bold rates, label-only headings, a bullet-list ending.
- **Flagged phrases** that generated text overuses: "delve", "crucial", "serves as a".

## 3. Judge each one by hand

Neither tier is applied automatically, because cutting the wrong clause can change meaning.
For each finding, read the sentence in context and edit it or leave it.

- A single flagged word isn't automatically wrong: I may use a few of them myself. A cluster
  in one draft is the signal.
- Don't rewrite something that genuinely reads right just to clear the report.
- Don't skip the pass because my own writing isn't perfectly uniform either.

Exit code 1 only means findings remain. Once you've judged every one, you're done.
