---
name: fingerprint-scrub
description: Run the bundled deterministic fingerprint scrub over a draft written or heavily edited by a model, and resolve what it reports — sentence rhythm, paragraph shape, punctuation rates and filler phrases measured against Brandon's published corpus. Use on any article or long post in his voice, after the voice self-critique and before the fact-check. Agent-agnostic.
---

# Fingerprint scrub

A non-LLM pass that measures a draft against the corpus norms in §1 of the `my-writing-style`
[style guide](../my-writing-style/references/style-guide.md) and the anti-pattern list in its
§9. It catches what reading tends to miss (sentence rhythm, punctuation rate, filler
phrases) and works the same whichever model or provider wrote the draft.

It's a smell detector calibrated on Brandon's published articles, not a gate. It never
blocks a build or a PR.

The script is in `scripts/` next to this file and needs only Node 18 or later. Below,
`SCRUB` stands for `node <this skill's folder>/scripts/scrub-fingerprint.mjs`.

## 1. Apply the safe fixes

```
SCRUB --file <draft>.md --fix
```

`--fix` only applies the fixable tier in `scripts/lib/fingerprint-patterns.mjs`: chatbot
artifacts ("I hope this helps!") and filler substitutions ("in order to" → "to"). These
preserve meaning by construction. Frontmatter is left alone.

## 2. Read the report

```
SCRUB --file <draft>.md
```

Add `--json` to process the findings programmatically. There are two kinds of finding, with
line numbers:

- **Smells**, measured against the §1 norms: sentence length, paragraph shape, em-dash rate,
  generic headings, bullet-list endings.
- **Flagged phrases**, from the §9 list: "delve", "crucial", "serves as a".

The bold-rate threshold is for English. Dutch runs about 2.5 times heavier (§7), so ignore
that smell on a Dutch draft.

## 3. Judge each one by hand

Neither tier is applied automatically, because cutting the wrong clause can change meaning.
For each finding, read the sentence in context and edit it or leave it.

- A single flagged word isn't automatically wrong: the corpus uses a few of them. A cluster
  in one draft is the signal.
- Don't rewrite something that genuinely reads right just to clear the report.
- Don't skip the pass because the corpus itself isn't perfectly uniform.

Exit code 1 only means findings remain. Once you've judged every one, you're done.
