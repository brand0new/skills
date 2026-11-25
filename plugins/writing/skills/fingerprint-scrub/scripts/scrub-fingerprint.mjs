#!/usr/bin/env node
// Mechanical fingerprint scrub for ghostwritten drafts (writing plugin).
//
// Deterministic, non-LLM pass over an article's prose body, checked against
// the measured targets in my-writing-style/references/style-guide.md §1 and the
// anti-pattern list in §9. Catches things prompting alone tends to miss
// because they're below the level a system prompt operates at (sentence
// rhythm, punctuation rate) or because a model can satisfy the letter of an
// instruction ("vary paragraph length") while still missing it in practice.
//
// This is deliberately corpus-calibrated, not a generic AI-writing linter:
// some checks a generic tool would run (e.g. "flag curly quotes") are
// intentionally omitted here because Brandon's own published corpus uses
// them in roughly half its articles — see lib/fingerprint-patterns.mjs
// for the full rationale on what's included and why.
//
// Usage:
//   node scripts/scrub-fingerprint.mjs --file <draft>.md
//   node scripts/scrub-fingerprint.mjs --file <path> --fix
//   node scripts/scrub-fingerprint.mjs --file <path> --json
//
// --fix only applies the FIXABLE_SUBSTITUTIONS / FIXABLE_SENTENCE_PATTERNS
// tables (safe, meaning-preserving, mechanical). Everything else is
// reported with line numbers for a human or agent to judge in context —
// see the FLAGGED tier in lib/fingerprint-patterns.mjs for why
// those aren't auto-edited (removing the wrong clause can change meaning).
//
// Exit code: 0 if clean (or --fix applied and now clean), 1 if issues
// remain to review. Designed to be run by the ghostwrite skill
// after the voice self-critique and before the fact-check.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  FIXABLE_SUBSTITUTIONS,
  FIXABLE_SENTENCE_PATTERNS,
  FLAGGED_PATTERNS,
} from "./lib/fingerprint-patterns.mjs";

// Corpus norms from style-guide.md §1. "target" is the measured mean;
// "flagAbove"/"flagBelow" are the thresholds this script actually alerts
// on — set looser than the raw target so normal article-to-article
// variance doesn't trigger false positives. These numbers came from
// eleven articles, not eleven thousand; treat them as a smell detector,
// not a hard gate.
const NORMS = {
  wordsPerSentenceMean: { target: 17, flagAbove: 22 },
  maxReasonableSentenceWords: 35, // style guide: "essentially absent" above this
  singleSentenceParagraphShare: { target: 0.5, flagBelow: 0.3 },
  shortPunchSentenceShare: { target: 0.1, flagBelow: 0.03 },
  // Individual articles vary a lot around the ~2/1000 corpus mean (observed
  // range across the 13 published articles: 0-5/1000). flagAbove is set
  // above the observed single-article max so a normal article doesn't trip
  // this on its own, while a clearly heavier LLM-provider habit still does.
  emDashPer1000Words: { target: 2, flagAbove: 7 },
  emojiPer1000Words: { target: 1, flagAbove: 2 },
  boldSpansPer1000WordsEN: { target: 10, flagAbove: 20 },
};

const GENERIC_HEADINGS = [
  "introduction",
  "background",
  "conclusion",
  "key takeaways",
  "understanding",
  "overview",
];

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) args[key] = true;
    else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

function splitFrontmatter(raw) {
  const m = /^---\n[\s\S]*?\n---\n/.exec(raw);
  if (!m) return { frontmatter: "", body: raw };
  return { frontmatter: m[0], body: raw.slice(m[0].length) };
}

// Rough sentence splitter, scoped to a single paragraph: good enough for a
// smell-detector, not meant to be a full NLP tokenizer. Splits on ./!/?
// Operating paragraph-by-paragraph (rather than on the whole body) avoids
// merging a punctuation-less line (an italic standfirst, a blockquote
// ending in a curly quote with no period) into the next paragraph as one
// implausibly long "sentence".
function splitSentences(text) {
  const cleaned = text
    .replace(/```[\s\S]*?```/g, " ") // drop code fences
    .replace(/`[^`]*`/g, " ") // drop inline code
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1"); // links -> link text only
  const matches = cleaned.match(/[^.!?]+[.!?]+(?=\s|$)/g) || [];
  return matches.map((s) => s.trim()).filter(Boolean);
}

function splitParagraphs(body) {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith("#") && !p.startsWith(">") && !p.startsWith("-") && !p.startsWith("```"));
}

function countWords(text) {
  return (text.match(/\S+/g) || []).length;
}

function lineOf(body, index) {
  return body.slice(0, index).split("\n").length;
}

function analyze(body) {
  const totalWords = countWords(body);
  const allParagraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  // Sentence stats are computed paragraph-scoped and then flattened, so a
  // sentence never spans a paragraph break (see splitSentences comment).
  const sentences = allParagraphs.flatMap((p) => splitSentences(p));
  const sentenceWordCounts = sentences.map(countWords);
  const meanSentenceWords =
    sentenceWordCounts.reduce((a, b) => a + b, 0) / (sentenceWordCounts.length || 1);
  const longSentences = sentences.filter(
    (s, i) => sentenceWordCounts[i] > NORMS.maxReasonableSentenceWords,
  );
  const shortPunchCount = sentenceWordCounts.filter((w) => w < 8).length;
  const shortPunchShare = shortPunchCount / (sentences.length || 1);

  const paragraphs = splitParagraphs(body);
  const paragraphSentenceCounts = paragraphs.map((p) => splitSentences(p).length);
  const singleSentenceCount = paragraphSentenceCounts.filter((c) => c === 1).length;
  const singleSentenceShare = singleSentenceCount / (paragraphs.length || 1);

  const emDashCount = (body.match(/\u2014/g) || []).length;
  const emojiCount = (
    body.match(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,
    ) || []
  ).length;
  const boldSpans = (body.match(/\*\*[^*]+\*\*/g) || []).length;

  const headings = [...body.matchAll(/^#{2,3}\s+(.+)$/gm)];
  const genericHeadings = headings.filter((h) =>
    GENERIC_HEADINGS.some((g) => h[1].trim().toLowerCase() === g),
  );

  // Last non-empty block is a bullet/numbered list -> likely a
  // summary-bullet ending, the loudest closing tell per style-guide.md §4/§9.
  // Excluded: a "## Links" (or "More on this topic") section is an
  // explicitly sanctioned closing device (§4) — a sourced link list is not
  // the same tell as a bullet recap of the article's own points.
  const blocks = body
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  const lastBlock = blocks[blocks.length - 1] || "";
  const precedingBlock = blocks[blocks.length - 2] || "";
  const isLinksSection =
    /^#{2,3}\s*links\b/i.test(precedingBlock) ||
    /more on this topic/i.test(precedingBlock);
  const endsOnBulletList =
    !isLinksSection &&
    /^[-*]\s/.test(lastBlock) &&
    lastBlock.split("\n").every((l) => !l.trim() || /^[-*]\s/.test(l.trim()));

  return {
    totalWords,
    meanSentenceWords,
    longSentences,
    shortPunchShare,
    singleSentenceShare,
    paragraphCount: paragraphs.length,
    emDashPer1000: (emDashCount / (totalWords || 1)) * 1000,
    emojiPer1000: (emojiCount / (totalWords || 1)) * 1000,
    boldSpansPer1000: (boldSpans / (totalWords || 1)) * 1000,
    genericHeadings: genericHeadings.map((h) => h[1].trim()),
    endsOnBulletList,
  };
}

function runFlaggedPatterns(body) {
  const hits = [];
  for (const { name, regex } of FLAGGED_PATTERNS) {
    const re = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : regex.flags + "g");
    let m;
    while ((m = re.exec(body)) !== null) {
      hits.push({ pattern: name, match: m[0], line: lineOf(body, m.index) });
      if (m[0].length === 0) re.lastIndex++; // guard against zero-width infinite loop
    }
  }
  return hits;
}

function applyFixes(body) {
  let fixed = body;
  let count = 0;
  for (const [regex, replacement] of FIXABLE_SUBSTITUTIONS) {
    const matches = fixed.match(regex);
    if (matches) count += matches.length;
    fixed = fixed.replace(regex, replacement);
  }
  for (const regex of FIXABLE_SENTENCE_PATTERNS) {
    const matches = fixed.match(regex);
    if (matches) count += matches.length;
    fixed = fixed.replace(regex, "");
  }
  // Clean up whitespace left behind by deletions: collapse runs of spaces,
  // trim trailing spaces before newlines, collapse 3+ blank lines to 2,
  // and trim a leading space left at the start of a line/paragraph by a
  // deleted leading phrase or sentence.
  fixed = fixed
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/(^|\n)[ \t]+/g, "$1");
  // A removed leading filler phrase ("It is important to note that ...")
  // can leave the next word lowercase at a sentence/paragraph start.
  // Re-capitalize the first letter after a paragraph break or sentence-end
  // punctuation, since the fixable-phrase tables only ever delete text and
  // never rewrite what follows.
  fixed = fixed
    .replace(/(^|\n\n)([a-z])/g, (_, pre, ch) => pre + ch.toUpperCase())
    .replace(/([.!?]\s+)([a-z])/g, (_, pre, ch) => pre + ch.toUpperCase());
  return { fixed, count };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.file) {
    console.error(
      "Usage: node scripts/scrub-fingerprint.mjs --file <path> [--fix] [--json]",
    );
    process.exitCode = 1;
    return;
  }

  // npm runs workspace scripts from the workspace directory, so resolve --file
  // against the directory the command was typed in (INIT_CWD) instead.
  const file = path.resolve(process.env.INIT_CWD ?? process.cwd(), args.file);
  const raw = await readFile(file, "utf-8");
  const { frontmatter, body: originalBody } = splitFrontmatter(raw);

  let body = originalBody;
  let fixCount = 0;
  if (args.fix) {
    const result = applyFixes(originalBody);
    body = result.fixed;
    fixCount = result.count;
    if (fixCount > 0) {
      await writeFile(file, frontmatter + body, "utf-8");
    }
  }

  const stats = analyze(body);
  const flagged = runFlaggedPatterns(body);

  const smells = [];
  if (stats.meanSentenceWords > NORMS.wordsPerSentenceMean.flagAbove) {
    smells.push(
      `Mean sentence length ${stats.meanSentenceWords.toFixed(1)} words (corpus target ~${NORMS.wordsPerSentenceMean.target}, flag above ${NORMS.wordsPerSentenceMean.flagAbove}).`,
    );
  }
  if (stats.longSentences.length > 0) {
    smells.push(
      `${stats.longSentences.length} sentence(s) over ${NORMS.maxReasonableSentenceWords} words (corpus has essentially none): "${stats.longSentences[0].slice(0, 80)}..."`,
    );
  }
  if (stats.singleSentenceShare < NORMS.singleSentenceParagraphShare.flagBelow) {
    smells.push(
      `Only ${(stats.singleSentenceShare * 100).toFixed(0)}% of paragraphs are single-sentence (corpus target ~${NORMS.singleSentenceParagraphShare.target * 100}%). Uniform paragraph length is the loudest tell per style-guide.md §9.`,
    );
  }
  if (stats.shortPunchShare < NORMS.shortPunchSentenceShare.flagBelow) {
    smells.push(
      `Only ${(stats.shortPunchShare * 100).toFixed(1)}% of sentences are short punch sentences under 8 words (corpus target ~${NORMS.shortPunchSentenceShare.target * 100}%).`,
    );
  }
  if (stats.emDashPer1000 > NORMS.emDashPer1000Words.flagAbove) {
    smells.push(
      `Em dash rate ${stats.emDashPer1000.toFixed(1)}/1000 words (corpus target ~${NORMS.emDashPer1000Words.target}/1000, flag above ${NORMS.emDashPer1000Words.flagAbove}). Classic LLM-provider tic.`,
    );
  }
  if (stats.emojiPer1000 > NORMS.emojiPer1000Words.flagAbove) {
    smells.push(
      `Emoji rate ${stats.emojiPer1000.toFixed(1)}/1000 words (corpus target <${NORMS.emojiPer1000Words.target}/1000).`,
    );
  }
  if (stats.boldSpansPer1000 > NORMS.boldSpansPer1000WordsEN.flagAbove) {
    smells.push(
      `Bold span rate ${stats.boldSpansPer1000.toFixed(1)}/1000 words (EN corpus target ~${NORMS.boldSpansPer1000WordsEN.target}/1000, flag above ${NORMS.boldSpansPer1000WordsEN.flagAbove}). Note: Dutch articles run ~2.5x heavier per style-guide.md §7 — don't apply this threshold to a Dutch draft.`,
    );
  }
  if (stats.genericHeadings.length > 0) {
    smells.push(
      `Generic/structural heading(s) used: ${stats.genericHeadings.join(", ")}. Style guide §9/§6: headings should be evocative, never labels.`,
    );
  }
  if (stats.endsOnBulletList) {
    smells.push(
      `Article ends on a bullet/numbered list. Style guide §4/§9: never end with a summary-bullet recap — he lands on a line, not a list.`,
    );
  }

  const report = {
    file: args.file,
    fixesApplied: fixCount,
    stats: {
      totalWords: stats.totalWords,
      meanSentenceWords: Number(stats.meanSentenceWords.toFixed(1)),
      singleSentenceParagraphShare: Number(stats.singleSentenceShare.toFixed(2)),
      shortPunchSentenceShare: Number(stats.shortPunchShare.toFixed(2)),
      emDashPer1000Words: Number(stats.emDashPer1000.toFixed(1)),
      emojiPer1000Words: Number(stats.emojiPer1000.toFixed(1)),
      boldSpansPer1000Words: Number(stats.boldSpansPer1000.toFixed(1)),
    },
    smells,
    flaggedPatterns: flagged,
  };

  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`\nFingerprint scrub: ${args.file}`);
    if (fixCount > 0) {
      console.log(`Applied ${fixCount} mechanical fix(es) (chatbot artifacts, filler phrases).`);
    }
    console.log(
      `Words: ${stats.totalWords} | mean sentence: ${stats.meanSentenceWords.toFixed(1)}w | single-sentence paragraphs: ${(stats.singleSentenceShare * 100).toFixed(0)}% | em dash: ${stats.emDashPer1000.toFixed(1)}/1000w | bold: ${stats.boldSpansPer1000.toFixed(1)}/1000w`,
    );
    if (smells.length > 0) {
      console.log(`\n${smells.length} smell(s) to review:`);
      for (const s of smells) console.log(`  - ${s}`);
    } else {
      console.log("\nNo mechanical smells detected.");
    }
    if (flagged.length > 0) {
      console.log(`\n${flagged.length} flagged phrase(s) to review by hand (not auto-fixed):`);
      for (const h of flagged) {
        console.log(`  - line ${h.line} [${h.pattern}]: "${h.match}"`);
      }
    }
  }

  process.exitCode = smells.length > 0 || flagged.length > 0 ? 1 : 0;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
