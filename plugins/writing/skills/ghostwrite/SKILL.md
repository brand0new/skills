---
name: ghostwrite
description: Turn a rough seed (a thumb-typed note, a dictated memo, a handful of bullets) into a finished, full-length article in Brandon's voice — outline and questions first, then research, draft, self-critique, fingerprint scrub and fact-check, ending with a hand-over that lists what was added and where every fact came from. Use when the user pastes raw notes and asks for an article, blog post or essay, or when another skill (such as portfolio-site's publish-article) needs a draft. Agent-agnostic.
---

# Ghostwrite

Takes a seed and produces a **finished article in Brandon's voice**. Expansion is the job,
not a liberty: a 200-word note becoming a 1,300-word article is the expected outcome. This
skill ends with a draft and its hand-over notes. Publishing it somewhere is the caller's
business (for a portfolio site, the `publish-article` skill).

**Read the `my-writing-style` skill and its full
[style guide](../my-writing-style/references/style-guide.md) before writing a single line of
prose.** It's the whole point of this procedure; the mechanical steps are the easy half.

If the person or client running this brings its own tone-of-voice instructions, those take
precedence over the style guide.

## The contract: fact versus craft

The boundary is not length. It's what may be invented. §10 of the style guide is the full
contract; in short:

- **Invent freely:** structure, headings, the roadmap sentence, argument development,
  everyday analogies, explicitly hypothetical scenarios, generic technical illustrations.
- **Never invent:** statistics, quotes, citations, links, anything he personally did
  (engagements, customers, what a tool did when he ran it), positions the note is silent
  on, or the verified behaviour of a specific tool version. That includes the state of
  his own tools: don't call a part of his setup solved or unsolved unless he said so.
- **Research can supply** a number, a quote, a link or what a specification says, as long
  as you opened the source in this run and list it (the `fact-check` skill). It can never
  supply what he did or what he thinks.

Where a needed fact is missing and can't be looked up, ask. Where a gap is small enough to
write around, write around it and flag the spot in the hand-over.

## Procedure

1. **Read the note for what it wants to say.** Find the claim it's making, not just its
   topic, and decide whether the piece is reflective or technical. Read style guide §3 and
   §4 now, because the outline already commits to an opening and a close.

   Then triage the facts. A thin note isn't a problem; a note missing _facts_ is. Signals
   that you'd have to invent something:
   - it points at a number, report or source it doesn't contain ("that stat about API
     sprawl")
   - it refers to something he did without describing it (an engagement, a tool he built,
     a conversation, a customer)
   - it names a position without stating it ("my take on X") and X isn't inferable
   - it promises a verdict it never gives ("discuss whether it's viable")

2. **Propose the outline, and ask.** Every article gets this step, however complete the
   note: it's where he steers the piece before a thousand words exist. Give him:
   - a working **title**, and the **angle** in one sentence: what the article argues
   - the **sections**, one line each (five is the norm), including the opening and the close
   - the **language** (match the note; never translate on your own initiative)
   - what you intend to **look up**
   - **questions**, at most five, only about what you'd otherwise have to invent and can't
     look up, each answerable in a sentence from a phone. A self-contained note may need
     none.

   End by saying that a reply with answers or changes starts the draft, and that "go" is
   enough. Then stop and wait. Keep it short enough to judge on a phone: it's a proposal,
   not a draft. The caller decides where this goes (a chat reply, an issue comment).

3. **Fold in his reply.** His reply outranks your outline. If he changes the angle, drops a
   section or answers differently than you assumed, that's the brief now. If an answer
   still leaves a central fact missing, ask once more and name the sections you can
   already write. Otherwise carry on, and write around small gaps.

4. **Research.** Follow `fact-check` §1 on the agreed outline before drafting: primary
   sources for what the piece leans on, and a check of what the note asserts about public
   things. Keep the source list.

5. **Write the article.**
   - Re-read the style guide first, every time. It carries measured targets (17 words per
     sentence, about 29 per paragraph, half of them single-sentence, five `##` sections),
     plus the opening and closing moves and the anti-pattern list.
   - **Read two of his published articles in full before drafting**, not just the guide's
     summary of them. The guide is a lossy description; the prose is the real target. For
     English: `trust-in-ai` (reflective register) and `automate-api-governance` (technical
     register). For Dutch: `begrijp-jij-bitcoin` and `de-waarde-van-een-blockchain`. They
     live at `https://brandonverzuu.com/articles/<slug>`, or in that site's repository when
     you're working in it.
   - Target **1,000 to 1,600 words** (the corpus mean is 1,285).
   - Self-check against style guide §1 and §9 before you call it a draft. Uniform
     four-sentence paragraphs and a summary-bullet ending are the two loudest tells.

6. **Self-critique, once.** Separately from the numeric check, re-read the whole draft and
   ask: **"What makes this read as AI-generated rather than something Brandon actually
   wrote?"** Judge it against his anti-pattern list (§9), not a generic checklist: a draft
   can be free of generic tells and still read like nobody in particular. Note what you
   find in a few bullets, revise once, and stop. More passes over-smooth the draft and sand
   off the self-deprecating, hedged register (§2), which is a regression of its own.

7. **Fingerprint scrub.** Run the `fingerprint-scrub` skill on the draft. It's
   deterministic, so it catches rhythm and filler that reading misses.

8. **Fact-check.** Follow `fact-check` §2 and §3 on the scrubbed draft. Run it after the
   scrub, not before: an edit made for rhythm can change what a sentence claims.

9. **Hand it over.** Alongside the draft, give:
   - a two-line summary and the word count
   - **What I added**: every substantive move that wasn't in the note or his replies (the
     argument developments, the analogies, the hypothetical examples)
   - **Sources**, from `fact-check` §4, and any **Corrections** to what the note said
   - any spot where you wrote around a missing fact

   Most of the prose is yours, so these lists are what keeps the draft auditable. When the
   draft lands in a PR, they go in its body.
