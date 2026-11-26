---
name: ghostwrite
description: Turn a rough seed of mine (a quick note, a dictated memo, a handful of bullets) into a finished, full-length article in my voice — outline and questions first, then research, draft, self-critique, fingerprint scrub and fact-check, ending with a hand-over that lists what was added and where every fact came from. Use when I paste raw notes and ask for an article, blog post or essay, or when another skill (such as portfolio-site's publish-article) needs a draft. Agent-agnostic.
---

# Ghostwrite

Takes a seed of mine and produces a **finished article in my voice**. Expansion is the job,
not a liberty: a 200-word note becoming a 1,300-word article is the expected outcome. This
skill ends with a draft and its hand-over notes. Publishing it somewhere is the caller's
business (for a portfolio site, the `publish-article` skill).

**Find and read my voice guide before writing a single line of prose** (the
`my-writing-style` skill says where it lives). It's the whole point of this procedure; the
mechanical steps are the easy half. With no voice guide, stop and offer to build one with the
`voice-guide` skill: a full article written without one is a guess.

If I give you other tone-of-voice instructions for a piece, those take precedence over the
guide.

## The contract: fact versus craft

The boundary is not length. It's what may be invented. §10 of my voice guide is the full
contract; in short:

- **Invent freely:** structure, headings, argument development, everyday analogies,
  explicitly hypothetical scenarios, generic technical illustrations.
- **Never invent:** statistics, quotes, citations, links, anything I did (engagements,
  customers, what a tool did when I ran it), positions my note is silent on, or the verified
  behaviour of a specific tool version. That includes the state of my own projects: don't
  call something of mine solved or unsolved unless I said so.
- **Research can supply** a number, a quote, a link or what a specification says, as long as
  you opened the source in this run and list it (the `fact-check` skill). It can never supply
  what I did or what I think.

Where a needed fact is missing and can't be looked up, ask me. Where a gap is small enough to
write around, write around it and flag the spot in the hand-over.

## Procedure

1. **Read the note for what it wants to say.** Find the claim it makes, not just its topic,
   and decide which register of my guide it belongs to. Read the guide's sections on openings
   and closings now, because the outline already commits to both.

   Then triage the facts. A thin note isn't a problem; a note missing _facts_ is. Signals that
   you'd have to invent something:
   - it points at a number, report or source it doesn't contain ("that stat about…")
   - it refers to something I did without describing it (a project, a client, a
     conversation)
   - it names a position without stating it ("my take on X") and X can't be inferred
   - it promises a verdict it never gives ("discuss whether it's viable")

2. **Propose the outline, and ask.** Every article gets this step, however complete the note:
   it's where I steer the piece before a thousand words exist. Give me:
   - a working **title**, and the **angle** in one sentence: what the article argues
   - the **sections**, one line each, including the opening and the close
   - the **language** (match my note; never translate on your own initiative)
   - what you intend to **look up**
   - **questions**, at most five, only about what you'd otherwise have to invent and can't
     look up, each answerable in a sentence from a phone. A self-contained note may need none.

   End by saying that a reply with answers or changes starts the draft, and that "go" is
   enough. Then stop and wait. Keep it short enough to judge on a phone: it's a proposal, not a
   draft. The caller decides where it goes (a chat reply, an issue comment).

3. **Fold in my reply.** My reply outranks your outline. If I change the angle, drop a section
   or answer differently than you assumed, that's the brief now. If an answer still leaves a
   central fact missing, ask once more and name the sections you can already write.
   Otherwise carry on, and write around small gaps.

4. **Research.** Follow `fact-check` §1 on the agreed outline before drafting: primary sources
   for what the piece leans on, and a check of what my note asserts about public things. Keep
   the source list.

5. **Write the article.**
   - Re-read the voice guide first, every time: its numbers (§1), its opening and closing moves
     and its anti-patterns.
   - **Read the example pieces the guide names, in full, before drafting.** The guide is a
     lossy description of my writing; the pieces are the real target. Match their sentence
     rhythm and paragraph shape, not only the numbers.
   - Aim for the length range in §1 of the guide.
   - Self-check against §1 and §9 before calling it a draft. Uniform paragraphs and a
     summary-bullet ending are the two loudest tells.

6. **Self-critique, once.** Separately from the numeric check, re-read the whole draft and ask:
   **"What makes this read as AI-generated rather than something I actually wrote?"** Judge it
   against my guide's anti-patterns, not a generic checklist: a draft can be free of generic
   tells and still read like nobody in particular. Note what you find in a few bullets, revise
   once, and stop. More passes over-smooth the draft and sand off the quirks my guide asks for,
   which is a regression of its own.

7. **Fingerprint scrub.** Run the `fingerprint-scrub` skill on the draft. It's deterministic,
   so it catches rhythm and filler that reading misses.

8. **Fact-check.** Follow `fact-check` §2 and §3 on the scrubbed draft. Run it after the scrub,
   not before: an edit made for rhythm can change what a sentence claims.

9. **Hand it over.** Alongside the draft, give me:
   - a two-line summary and the word count
   - **What I added**: every substantive move that wasn't in my note or my replies (the
     argument developments, the analogies, the hypothetical examples)
   - **Sources**, from `fact-check` §4, and any **Corrections** to what my note said
   - any spot where you wrote around a missing fact

   Most of the prose is yours, so these lists are what keeps the draft auditable. When the
   draft lands in a PR, they go in its body.
