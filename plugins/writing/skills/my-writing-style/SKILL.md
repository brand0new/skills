---
name: my-writing-style
description: Write, draft, rewrite or edit text in my own personal voice, following my voice guide. Use whenever I ask for an article, blog post, LinkedIn post, email, message or other text I'll publish or send under my own name, even if I never mention style or voice. Use this rather than brand-voice skills unless I ask for company or brand guidelines. Not for code, UI copy, or work in a client's or employer's brand voice.
---

# My writing style

Anything that goes out under my name should read as if I wrote it. My voice guide says what
that means. This skill finds the guide, applies it, and checks the result before you hand it
over.

It doesn't cover code, UI copy, or content in a client's or employer's brand voice: those
follow their own guidelines.

## 1. Find my voice guide

Look in this order and use the first one you find:

1. A path I give you in the conversation.
2. A path named in the project's `AGENTS.md` or `CLAUDE.md` (a line such as
   `Voice guide: docs/VOICE.md`).
3. `VOICE.md` at the root of the current repository.
4. `~/.agents/voice/VOICE.md`, my personal guide for every project.

Next to the guide there may be a `fingerprint-norms.json`: the measured numbers that the
`fingerprint-scrub` skill checks a draft against.

**If there's no guide**, tell me, and offer to build one with the `voice-guide` skill from a
handful of pieces I've written. For a short message you may carry on without one: write
plainly, follow "What gives a draft away" below, and say the result is a best guess at my
voice. For a whole article, build the guide first.

## 2. Write in my voice

Read the whole guide before you write, not only the parts that seem relevant. Then:

- **Match the register.** If the guide distinguishes registers (a reflective essay, a
  tutorial, an analysis), pick the one that fits and follow its dials: pronouns, number of
  questions, humour, shape.
- **Write to the numbers.** Sentence length, paragraph shape and punctuation rates are what
  a reader feels without noticing. Uneven paragraph length matters most.
- **Use my moves.** My openings, closings, sentence habits and devices are in the guide. Use
  them where they fit, not all at once.
- **Match the language** of what I gave you, and never translate on your own initiative. If
  the guide has a section for that language, it overrides the general rules.
- **Read the example pieces** the guide names, in full, before drafting anything longer than
  a few paragraphs. The guide describes my writing; the examples are my writing.

For formats the guide wasn't measured on (posts, emails, messages), keep the voice and
shorten the structure, and tell me the format is a best guess.

## 3. Editing my text

When I supply text, keep my wording, my order and my argument. Change only what I asked for,
and fix real errors such as typos and then/than slips. Editing shouldn't turn my draft into
your approximation of my voice, so leave a rough sentence alone if it's clear. If a bigger
rewrite would help, suggest it rather than doing it.

## 4. What gives a draft away

Check every draft against these generic tells of generated text, plus the anti-patterns in
my guide:

- Stock openers and fillers: "In today's fast-paced world", "It's important to note that",
  "Let's dive in!"
- Built-up parallel contrast such as "it's not just X, it's Y" and tidy triads
- Headings that only label: "Introduction", "Understanding X", "Key takeaways"
- Uniform paragraphs: four tidy sentences in every block
- A summary-bullet recap at the end
- Stacked hedges such as "it may potentially"
- Enthusiasm with no cost named
- Em-dashes in every paragraph
- Explaining the reader's feelings to them ("You might be thinking...")

For a full article, follow up with the `fingerprint-scrub` skill.

## 5. Never invent

Structure, arguments, analogies and clearly hypothetical examples are yours to write. These
are not:

- Statistics or measured claims
- Quotes, citations or links
- Anything I did: customers, engagements, employers, conversations, what a tool did when I
  ran it
- Positions I haven't taken
- Verified behaviour of a specific tool or version

If one of these is missing, ask me one specific question. If the gap is small, write around
it and point it out. The `fact-check` skill covers what research may supply.
