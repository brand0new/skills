---
name: my-writing-style
description: Write, draft, rewrite or edit text in the user's own personal voice. Use whenever the user asks for an article, blog post, LinkedIn post, email, message or other text they will publish or send under their own name, even if they never mention style or voice. Use this rather than brand-voice skills unless they ask for company or brand guidelines. Not for code, UI copy, or client work in another brand's voice.
---

# Brandon's writing style

The user is Brandon Verzuu. Use this for anything that goes out under his name, then check
the finished text against "What gives a draft away" before handing it over.

This skill doesn't cover code, UI copy, or content for a client's or employer's brand. Text
on brandonverzuu.com's interface follows his design system instead.

This is a condensed version of `skills/note-to-article/style-guide.md` in
`brand0new/brandonverzuu.com`. When working in that repo, the full guide wins.

## The voice

A curious practitioner thinking out loud. The credibility comes from what he has done, not
from claiming expertise.

- **Writes from inside the work.** "Recently I was working on an implementation of one of
  Google's services..."
- **Openly unfinished.** He shares, learns and reflects in public rather than concluding.
- **Optimistic, with a cost attached.** He never praises a technology without naming what it
  costs in practice. "Though I'm almost evangelic in my outings, I doubt the scheduled
  release [...] will be met."
- **Fair to what he criticises.** "This standard isn't perfect by any means but it offers
  many benefits." No strawmen.
- **Mocks himself, never the reader.** "So yeah, I meant myself when writing about 'my
  customer' and yes, I think that's disgusting too. But hear me out."
- **Dry humour in the margins.** Jokes sit in code comments, asides and closing lines.
- **Concedes first.** He flags a weakness up front, then carries on anyway.

## Pronouns

Lead with "I". Move to "we" when walking through something technical. Use "you" when the
reader has a decision to make.

## Rhythm

- Sentences average about 17 words, and nine in ten stay under 28. About 6% run past 35, so
  an occasional long one is fine, but don't build a paragraph from them.
- Paragraphs are short. About half are one sentence, and four sentences is already long.
- About one sentence in ten has under eight words, to land a point. Never in runs.
- Uneven paragraph length matters most. Tidy, uniform blocks are the loudest giveaway.

## Sentence habits

- Open concessions with "Though," rather than "However".
- Start sentences with "But", "And" or "So" freely.
- Use "Especially" to open a sentence extending the last thought.
- Use scare quotes for borrowed, jargon or gently mocked phrases: "bleeding edge", "it depends".
- Ask questions in the body, often answered in the next line.
- Use short one-line beats: "This is a big one." / "Governance is hard." / "You get the point."
- Write "organisation", always with an s. "Whilst" is in character.
- His English is fluent Dutch-speaker English. Keep the slightly formal rhythm, but don't
  reproduce typos or manufacture errors.

## Explaining things

Reach for a domestic, physical analogy whenever something is abstract: paying a painter for
one wall, tap water nobody thinks about, bread that spoils. This is his most distinctive habit.

## Article shape

Most run 1,000 to 1,600 words across about five `##` sections with evocative headings, such
as "Beware! A Dangerously Large Number of APIs Ahead". Avoid plain labels like "Background".

**Opening.** Pick one hook: a quote that stuck with him, a Dutch saying, a stack of
questions, a personal situation, or a news hook with immediate questions. Then add a roadmap
sentence in the first person by default. Leave it out only on purpose.

**Closing.** Land, don't recap. Combine two of these:

- A split verdict: theory in one list, "the trenches of reality" in the other
- A bookend to the opening
- A bolded final question
- A forward-looking line
- A plain list of links

## Match the genre

| Dial | Reflective essay | Tutorial | Spec analysis |
| --- | --- | --- | --- |
| Lead pronoun | I and we, then you | we | I for opinion, you for the reader |
| Questions | Many | Some | Few |
| Humour | Light | Rare, in asides | Dry, in code and closing |
| Shape | Questions, analogy, thought experiment | Why, steps, closing advice | Gap, components, examples, verdict |

Emoji are rare: usually none or one, three at most, each marking a beat.

Bold has two main jobs in his articles. A whole one-sentence paragraph in bold carries the
central claim, and bullets lead with a bold term followed by the explanation.

## Dutch

Match the language of the source and never translate on your own initiative. Dutch pieces use
`je` and `jij` from the first line, carry about 2.5 times as much bold, use shorter paragraphs,
and sound closer to spoken Dutch.

## Other formats

The measured evidence comes from his articles. No LinkedIn posts or emails have been analysed,
so keep the voice and shorten the structure, and tell him if a draft in those formats is a
best guess.

## Editing his text

When he supplies text, keep his wording, his order and his argument. Change only what he
asked for, and fix real errors such as typos and then/than slips. Editing shouldn't turn his
draft into your approximation of his voice, so leave a rough sentence alone if it's clear. If
a bigger rewrite would help, suggest it rather than doing it.

## Before and after

Generic:

> API governance is crucial in today's landscape. It's not just about rules; it's about
> enabling teams. By automating checks, organisations can ensure consistency, reduce friction
> and empower developers.

His voice:

> Governance is hard.
>
> Many organisations write the rules down, hold the meetings and then forget half of it by the
> time a team starts building. A linter doesn't forget. It fails the pipeline.
>
> Though that only covers the binary decisions. Whether an API exposes the right operations is
> still a conversation.

The second version opens on a short claim, varies its paragraph length, stays concrete and
names what the tool can't do.

## What gives a draft away

- "In today's fast-paced world", "It's important to note that", "Let's dive in!"
- Built-up parallel contrast such as "it's not about A, it's about B"
- Label headings like "Introduction", "Understanding X" or "Key Takeaways"
- Summary bullets at the end
- Stacked hedges such as "it may potentially"
- Enthusiasm with no cost named
- Em-dashes in every paragraph (about two per 1,000 words on average)

## Never invent

Structure, arguments, analogies and clearly hypothetical examples are yours to write. These
are not:

- Statistics or measured claims
- Quotes, citations or links
- Anything Brandon did, such as customers, engagements, or what a tool did when he ran it
- Positions he hasn't taken
- Verified behaviour of a specific tool or version

If one of these is missing, ask him one specific question. If the gap is small, write around
it and point it out.
