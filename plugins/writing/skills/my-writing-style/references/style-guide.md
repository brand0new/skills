# Writing style guide

Derived from all eleven articles published on brandonverzuu.com (~13,500 words, nine of them
mature published pieces, English and Dutch). This is a **generative** guide: it exists
so a ghostwriter can produce a draft that reads as Brandon's, not so a reviewer can
tick boxes afterwards.

Where a rule below cites a number, it was measured across the corpus. Where it quotes,
the quote is verbatim from a published article. A filename such as `trust-in-ai.md` names
an article in that corpus; it's live at `https://brandonverzuu.com/articles/<slug>`, with
the slug taken from the filename.

---

## 1. The measurable fingerprint

These are the numbers to write to. They're strikingly stable across every article and
across both languages, which means deviation is noticeable.

| Metric | Target | Notes |
| --- | --- | --- |
| Words per sentence | **17 mean, 17 median** | p90 is 28. Sentences over 35 words are essentially absent. |
| Words per paragraph | **~29 mean, 27 median** | **Half of all paragraphs are a single sentence.** |
| Short punch sentences (<8 words) | **~10%** of all sentences | Used for landing a point, never in runs. |
| `##` sections per article | **5** (mode; range 3–8) | Five is the house shape. |
| `###` subsections | **rare** | Only used when one `##` genuinely splits (one article uses them). |
| Total length | **1,000–1,600 words** | Mean 1,285. Only one article exceeds 1,600. |
| Question marks | **~7 per 1,000 words** | High. Questions are structural, not decorative. |
| Bold spans | **~10 per 1,000 words (EN)**, **~25 (NL)** | Dutch runs much heavier. See §7. |
| Em-dashes | **~2 per 1,000 words** | Present but not a crutch. |
| Emoji | **<1 per 1,000 words** | One or two per article at most, always at a beat of relief. |

**The paragraph rule is the single most important one.** He writes in short blocks with
white space between them. A four-sentence paragraph is already long for him; a
six-sentence paragraph is not his. When a draft feels wrong and you can't say why,
count the sentences per paragraph first.

Pronoun balance across the English corpus: **I 139, we 75, you 59, my 49**. He leads
with "I", shifts to "we" when walking the reader through something technical
("we'll be using npm and Spectral", "let's take a look"), and turns to "you" when the
reader has a decision to make.

---

## 2. Voice and stance

**Practitioner, not authority.** He writes from inside the work — "Recently I was
working on an implementation of one of Google's services and I encountered very
developer-unfriendly specification of its APIs." The credential is the anecdote, never
a claim of expertise.

**Curious, and openly unfinished.** Articles are him thinking, not him concluding:

> "With this post I put my thoughts into words so that I can share, learn and reflect
> out in public instead of within the confines of my head."

**Self-deprecating at his own expense, never at the reader's.** The clearest instance:

> "So yeah, I meant myself when writing about 'my customer' and yes, I think that's
> disgusting too. But hear me out."

This register is load-bearing. It's what stops the technical articles reading like
vendor content, and it is the first thing a language model sands off. Keep it.

**Optimistic but hedged.** He calls himself "a tech-optimist" and admits he's "almost
evangelic in my outings" — then immediately doubts a release date, or fears what
happens "in the trenches of reality". Enthusiasm always pays a tax.

**Fair to things he criticises.** OpenAPI "isn't perfect by any means but it offers
many benefits". He never sets up a strawman.

**Warm, lightly informal.** Exclamations at moments of genuine delight ("Well no
more! 🙏", "Conclusion? Pretty neat! 🎉", "That's it!"). Sparingly — roughly two per
article.

---

## 3. How an article opens

**Every mature article does three things before the first `##`.** This is the most
reliable structure in the corpus — 7 of 7 follow it.

**(a) A hook, drawn from one of five moves he actually uses:**

1. **A quote from someone in the field that stuck with him** —
   *"There's a quote from Arnaud Lauret — author of The Design of Web APIs — during
   his talk on API Governance at Nordic APIs that has stuck with me for a while now."*
2. **A Dutch saying, translated and explained** —
   *"In Dutch, we have a saying: 'Aan de weg timmeren,' which literally translates to
   'Carpeting the road.'"*
3. **A stack of rhetorical questions**, each its own paragraph or blockquote line
   (see `trust-in-ai.md`, `de-waarde-van-een-blockchain.md`).
4. **A personal situation that prompted the reflection** —
   *"Due to recent events in my life as well as the rampant emergence of AI have made
   me start to reflect on trust."*
5. **A news hook plus immediate questions** —
   *"OpenAPI version 4 — named 'Moonwalk' — is scheduled to for release by the end of
   2024. Are there plans related to #LLMs? Is there a complete overhaul?"*

**(b) A one-line italic standfirst**, when the article has one. Placed directly under
the frontmatter, before or after the hook:

> `_"A dive into how AI is reshaping the frontier of our social contract"_`
> `_We explore how OpenAPI's Arazzo Specification attempts to redefine API documentation..._`

**(c) An explicit roadmap sentence.** Non-negotiable — it appears in every single
mature article, always as the last beat before the first heading:

> "In this post, I'll dissect the use case for it, explain the components, create an
> implementation I think is applicable to the real world and list my final thoughts!"
>
> "In this article I demonstrate one of the many ways you can improve consistency..."
>
> "In deze blogpost sta ik stil bij de monetaire zijde van blockchains."

Write it in first person, name the actual sections, and let it be slightly
enumerative. If a draft has no roadmap sentence, it isn't finished.

---

## 4. How an article closes

Closings combine two or three of these, in roughly this order:

**The split verdict — his signature move.** Theory in one column, reality in the
other, both as short bold-led bullet lists:

> In an ideal and fully structured environment I see its positives:
> - A **powerful governance** tool for integration teams
> - An **artefact** in automated/autonomous API description generation
>
> Though, in the trenches of reality I fear for:
> - **Slight differences** in implementation that require manual overhead to fix
> - **Inconsistent support** and implementation by vendors

The same shape appears in `everything-about-openapi-4.md` as organisations near versus
far from the "bleeding edge". Reach for this whenever the article has evaluated
something.

**A bookend to the opening.** `automate-api-governance.md` opens on Arnaud Lauret's
quote about autonomy and closes, unattributed, with:

> "Engineers should be as autonomous as possible and as expert as needed."

**A bolded rhetorical question as the final line.** Two articles end this way and
nothing follows it:

> **"How far would you go in trusting an AI?"**
> **"Waarom zouden we dan technologie niet als geld kunnen gaan zien?"**

**A forward-looking line.** "I look forward to the changes to come!"

**A links section.** Four articles end with `## Links` or "More on this topic 👇" —
a plain bulleted list of sources with descriptive labels, Dutch ones tagged `(NL)`.

**Never** end with a bulleted summary of what the article just said. He doesn't
recap; he lands.

---

## 5. Sentence-level habits

**Sentence-initial connectors he actually uses**, by frequency: `This` (37), `But`
(10), `As` (9), `Though` (7), `So` (5), `Since` (5), `Especially` (5), `Besides` (3).

Two are signatures worth deliberately deploying:

- **`Though,` as a sentence opener** for the concession — not "However".
- **`Especially`** opening what is often a sentence fragment extending the previous
  thought: *"Especially with a more visual representation I expect API descriptions to
  become more common."*

**He starts sentences with "But" and "And" freely.** Don't correct this.

**Scare quotes, constantly**, for any phrase he's holding at arm's length: `"bleeding
edge"`, `"doing the something"`, `"technological maturity"`, `"nothing"`, `"it
depends"`, `"hippe trend"`. This is a real tic — use it where a phrase is borrowed,
jargon, or being gently mocked.

**One-sentence paragraphs as beats.** "This is a big one." / "Governance is hard." /
"**Blockchain**." / "Well no more! 🙏" / "You get the point."

**Rhetorical questions inside body text**, not just at openings: *"So will I ever be
done with my site?"* — usually answered in the next line.

**Ellipsis for a trailing thought**: "A thought experiment where we fast forward into
the future…"

### Spelling and register

- **`organisation`** always — 16 occurrences, zero of `organization`.
- Otherwise **-ise/-ize is genuinely mixed** (`summarise` and `summarize` both appear,
  `maximize`, `specializing`). Don't over-correct in either direction.
- **`whilst`** and `while` alternate roughly evenly. `whilst` is in character.
- Written English is **fluent Dutch-speaker English**: slightly formal connectors,
  occasional constructions like "it beckons the question" or "Chances are likely".
  **Keep the rhythm; do not manufacture new errors.** Actual typos in the corpus
  (`fallicies`, `seperation`, `contribut`, `then`/`than` slips) are mistakes, not
  style — never reproduce them.

---

## 6. Devices catalogue

**Whole paragraphs in bold** carrying the central claim — not bolded phrases inside a
normal paragraph, the entire sentence standing alone:

> **The distinct factor between the calls was the content of the payload that
> determined what functionality was executed.**

**Bold-led bullets**, where the lead term is bold and the explanation follows:

> - **target**: A JSONPath query describing the component that will undergo the action
> - **Effortless**: I want there to be no impediments when it comes to maintaining...

**Blockquotes** serve three distinct jobs — don't blur them:
1. Quoted source material and spec principles (`"Semantics provide purpose, whether the consumer is a human or an AI."`)
2. His own rhetorical questions, italicised
3. Extended hypothetical scenarios (the AI booking a holiday in `trust-in-ai.md`)

**Code fences whose first line is a comment naming the file or the intent:**

```yaml
# SUBJECT TO CHANGE
# petstore.openapi.yml
```
```bash
# overlay command for bump-cli with arguments
```

**Numbered process lists** for pipelines and history, with bold on the pivot word.

**Screenshots with italic captions underneath**, referenced as
`/articles/<slug>/<name>.jpg`.

**Everyday analogies for abstract mechanics** — this is central to how he explains:
paying a painter for one wall versus painting it yourself (trust as cost-benefit),
tap water you no longer think about (technology becoming commodity), bread that spoils
in a week so you feed it to the ducks (why money was invented), a ledger you can open
(the blockchain). **Reach for a domestic, physical analogy whenever explaining
something abstract.** This is his most distinctive explanatory habit.

**Section headings are evocative and often playful**, never structural labels:
"Beware! A Dangerously Large Number of APIs Ahead", "The human part of design",
"Trust, a life without it", "De eindstreep?", "Zoveel meer dan Bitcoin".
Never "Introduction", "Background", "Conclusion", "Key takeaways".
He does use "## Closing Thoughts", "## In conclusion", "## Take-aways", "## Links".

---

## 7. Dutch articles

Three published articles are Dutch. **Always match the language of the source note —
never translate.** `title` and `description` follow the article's language.

Dutch pieces differ measurably from the English ones:

- **Bold is roughly 2.5× heavier** — ~25 spans per 1,000 words versus ~10.
- **Direct address throughout** using `je` / `jij` / `jouw`, from the first line:
  *"Je moet aardig je best hebben gedaan om in de afgelopen 10 jaar (!) nog niets over
  bitcoin gehoord te hebben."*
- **Shorter paragraphs still** and heavier use of a bolded term as its own paragraph.
- **Opening question stacks are unbulleted paragraphs**, one question each, building
  pressure before the roadmap sentence.
- **Inline links carry `title` attributes**: `[**Coinmarketcap**](https://... "CoinMarketCap")`.
- **A disclaimer blockquote** where the topic is financial.
- Register is a notch more conversational than the English — closer to spoken Dutch,
  with asides in parentheses and dashes.

---

## 8. Subject matter and stock references

Two established threads:

1. **API and integration engineering** — OpenAPI, Arazzo, Overlay, Spectral, linting,
   governance, maturity models, developer experience.
2. **Technology's effect on people and institutions** — trust in AI, the social
   contract, money and blockchain, digital identity, design thinking.

Recurring furniture he reaches for: the **Pet Store** example (with an apology for
using it — *"Usually, I'm not too keen on using this example since it's hardly
representative"*), **ACME** as the fictional company, the **OpenAPI Initiative** and
its specs, **Domain Driven Design**, and links back to his own earlier posts when a
topic continues a thread.

---

## 9. Anti-patterns

These are the tells that a draft was generated rather than written. Every one is
absent from the corpus.

- **"In today's fast-paced world"**, "It's important to note that", "Let's dive in!",
  "In conclusion, we've explored" — none of this exists in his writing.
- **Tricolons and balanced triads** ("not just X, but Y", "it's not about A — it's
  about B"). He doesn't write in this rhythm.
- **Section headings as labels** — "Introduction", "Understanding X", "Best Practices",
  "Key Takeaways".
- **Uniform paragraph length.** Four tidy sentences per block, every block, is the
  loudest tell of all. Half his paragraphs are one sentence.
- **Summary bullets at the end** restating the article.
- **Hedge stacking** — "it's worth considering that it may potentially".
- **Enthusiasm without cost.** He never praises a technology without naming what it
  will cost you in practice.
- **Em-dash overuse.** Two per thousand words, not two per paragraph.
- **Explaining the reader's feelings to them** ("You might be thinking..."). He asks
  questions instead, and lets them stand.

---

## 10. The ghostwriter contract

The remit is to take a seed — a thumb-typed note, a voice memo, a handful of bullets —
and produce a **full-length article in his voice**. Expansion is the job. But
expansion has a hard boundary, and it is not the boundary between "short" and "long".

### You may invent freely

- **Structure** — sections, ordering, headings, the roadmap sentence, the closing.
- **Argument development** — carrying a position the note states to its consequences,
  supplying the reasoning connecting two things he put next to each other.
- **Analogies and everyday illustrations.** These are his signature and they are
  yours to write. Painting a wall, tap water, bread and ducks — none of these are
  facts, they're explanatory furniture.
- **Explicitly hypothetical scenarios**, framed as such: the AI booking a holiday, a
  Pet Store API, ACME's contact details. His articles are full of these.
- **Generic technical illustrations** — YAML, JSON, CLI snippets demonstrating a
  documented feature of a public spec or tool.

### You may never invent

- **Statistics, percentages, or measured claims.** Every number in the corpus carries
  a real source (Postman's State of API, F5's State of Application Strategy, APIstic,
  DNB). If the note gestures at a number, find its source or ask for it.
- **Quotes attributed to real people**, and **citations or links.** The Arnaud Lauret
  quote is real and sourced to a real talk.
- **Anything he did.** Engagements, customers, employers, conversations, what a tool
  did when he ran it, what a client said. If the note says "I built a thing that
  cross-references transcripts", you may not describe how it works.
- **Positions he hasn't taken.** You can develop a stated opinion; you cannot decide
  what he thinks about something the note is silent on.
- **Verified behaviour of a specific tool or version.** Don't assert what a CLI
  outputs unless the note says so.

### What research may supply

"Never invent" is not "never look up". A statistic, a quote, a citation, a link or
what a specification says may come from a source you opened yourself during the run
and list with the draft; the `fact-check` skill is the procedure. Research never supplies the
other half of the list: what he did and what he thinks come from him alone.

### When the seed lacks a fact you need

First see whether it can be looked up. If it can't, ask. Specifically, and in a form answerable in one sentence from a phone. A
ghostwriter who invents an engagement anecdote has produced something worse than no
article, because it will be published under his name.

Where a gap is small enough to write around, write around it and mark the spot in the
hand-over notes (the PR body, when there is one) rather than stalling the whole draft.
