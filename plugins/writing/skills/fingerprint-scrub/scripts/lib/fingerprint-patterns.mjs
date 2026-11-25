// Pattern tables for scripts/scrub-fingerprint.mjs. Kept separate from the
// script itself so the lists can be extended without touching control flow.
//
// Two tiers:
//   FIXABLE  — safe, meaning-preserving, mechanical. Applied verbatim when
//              the script runs with --fix. Every entry here must be safe to
//              apply blindly, with no chance of mangling a real sentence.
//   FLAGGED  — needs a human or agent to judge in context (deleting the
//              wrong clause could change meaning), so these are reported
//              with line numbers but never auto-edited.
//
// Sources: my-writing-style/references/style-guide.md §9 (Brandon's specific anti-pattern list, the
// primary reference) and the `humanizer` skill's generic AI-writing pattern
// list (used only where it doesn't conflict with something the corpus
// actually does — e.g. the corpus itself uses em dashes and question marks
// heavily, so those are rate-checked against corpus norms, not banned).

// --- FIXABLE: whole-phrase substitutions, meaning-preserving -------------
// [pattern (case-insensitive), replacement]. Replacement '' deletes the
// match; surrounding whitespace/punctuation cleanup happens in the script.
export const FIXABLE_SUBSTITUTIONS = [
  [/\bin order to\b/gi, "to"],
  [/\bdue to the fact that\b/gi, "because"],
  [/\bat this point in time\b/gi, "now"],
  [/\bin the event that\b/gi, "if"],
  [/\bhas the ability to\b/gi, "can"],
  [/\bhave the ability to\b/gi, "can"],
  [/\bit is important to note that\s*/gi, ""],
  [/\bit's important to note that\s*/gi, ""],
  [/\bit should be noted that\s*/gi, ""],
  [/\bin today's fast-paced world,?\s*/gi, ""],
  [/\ba testament to\b/gi, "evidence of"],
  [/\bstands as a testament to\b/gi, "shows"],
];

// --- FIXABLE: whole-sentence chatbot artifacts ----------------------------
// Matched as a full sentence (bounded by sentence-ish punctuation) and
// removed entirely — these never belong in published prose regardless of
// context, so removing the whole sentence is safe.
export const FIXABLE_SENTENCE_PATTERNS = [
  /\bI hope this helps!?/gi,
  /\bLet me know if you'?d like[^.!?]*[.!?]/gi,
  /\bCertainly!/gi,
  /\bOf course!/gi,
  /\bGreat question!/gi,
  /\bYou'?re absolutely right!?/gi,
  /\bAs an AI(?: language model)?,?[^.!?]*[.!?]/gi,
  /\bWhile specific details are (?:limited|scarce)[^.!?]*[.!?]/gi,
  /\bUp to my last training update[^.!?]*[.!?]/gi,
  /\bBased on available information,?\s*/gi,
];

// --- FLAGGED: regex patterns to report with line numbers, never auto-fix -
// Grouped to match style-guide.md §9 categories.
export const FLAGGED_PATTERNS = [
  {
    name: "significance inflation",
    regex:
      /\b(stands? as a testament|serves? as a (?:vital|significant|crucial|pivotal|key) (?:role|moment)|underscores? its (?:importance|significance)|marks? a (?:pivotal|significant) (?:moment|shift)|reflects broader|contributing to the (?:broader|ongoing)|setting the stage for|key turning point|evolving landscape|indelible mark|deeply rooted)\b/gi,
  },
  {
    name: "AI vocabulary words",
    regex:
      /\b(delve|delving|crucial|garner|fostering|foster|underscore[sd]?|showcas(?:e|es|ing)|tapestry|intricac(?:y|ies)|intricate|multifaceted|align(?:s|ed|ing)? with|robust(?:ly)?)\b/gi,
  },
  {
    name: "copula avoidance",
    regex: /\b(?:serves? as|stands? as)\s+(?:a|an|the)\b/gi,
  },
  {
    name: "negative parallelism / tailing negation",
    regex:
      /\bit'?s not (?:just|merely|only) [^.,;]+,?\s*(?:it'?s|but)\b|,\s*no (?:guessing|wasted \w+)\b/gi,
  },
  {
    name: "tricolon / rule of three cliché",
    regex: /\bnot just [^.,;]+,\s*but\s+[^.,;]+\s+and\s+[^.,;]+/gi,
  },
  {
    name: "generic positive conclusion",
    regex:
      /\bthe future (?:looks|is) bright\b|\bexciting times (?:lie|are) ahead\b|\ba (?:major |significant )?step in the right direction\b/gi,
  },
  {
    name: "signposting / announcements",
    regex:
      /\blet'?s (?:dive in|explore|break this down)\b|\bhere'?s what you need to know\b|\bwithout further ado\b/gi,
  },
  {
    name: "persuasive authority trope",
    regex:
      /\bthe real question is\b|\bat its core,?\b|\bwhat really matters\b|\bthe heart of the matter\b/gi,
  },
  {
    name: "reassurance kicker",
    regex:
      /\band that'?s (?:okay|fine)\.?\b|\bthere'?s nothing wrong with that\b|\byou'?re not alone\b|\bit'?s completely normal\b/gi,
  },
  {
    name: "sentence-opener tic (adverb)",
    regex: /^(?:Interestingly|Importantly|Notably|Crucially|Essentially|Ultimately),\s/gim,
  },
  {
    name: "vague attribution",
    regex:
      /\b(?:industry reports?|observers have (?:cited|noted)|experts (?:argue|believe|say)|some critics argue)\b/gi,
  },
  {
    name: "excessive hedging",
    regex: /\bcould potentially possibly\b|\bit could be argued that\b/gi,
  },
  {
    name: "hyphenated word-pair overuse (fixed compounds)",
    regex:
      /\b(?:cross-functional|client-facing|data-driven|decision-making|well-known|high-quality|real-time|long-term|end-to-end)\b/gi,
  },
];
