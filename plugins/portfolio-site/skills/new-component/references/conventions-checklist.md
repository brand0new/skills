# Conventions checklist

What a portfolio site's component conventions document should settle. Use it to write one
for a site that has none, or to spot gaps in one that exists. Each item has the question to
answer and, in italics, how brandonverzuu.com ("Noise to Signal") answers it, as a worked
example.

## Building blocks

- **Component model.** Which framework, rendered where, and when JavaScript ships.
  *Astro components rendered at build time; a `<script>` only when there's behaviour; no UI
  framework in the browser.*
- **Presentational or data-aware.** Which components may query content themselves.
  *Presentational by default: the page fetches. Homepage chapters and a few shared blocks
  may query through `src/lib/content.ts`.*
- **Look driven by data.** Where per-item styling comes from.
  *From content fields (a project's accent colour and font), never from a per-slug class.*
- **Where shared logic lives.** *Pure helpers in `src/lib/`; visual algorithms shared with
  build scripts in `scripts/lib/`, with the source named in a comment when ported.*

## Visual grammar

- **Layout primitives.** Rows, cards, panels: which one for what.
  *Rows, not cards: a heavy rule on top, hairlines between. Panels only for items with their
  own image. No rounded corners, shadows, gradients or blur.*
- **Typefaces and their jobs.** *Display face for titles and numerals, serif for reading,
  mono uppercase for labels, metadata, tags and buttons.*
- **Colour tokens.** The token names, where they're defined, and how contrast is checked.
  *Custom properties written from `scripts/lib/tokens.mjs`; text pairs listed there and
  checked for WCAG AA in both themes during the build.*
- **Colour roles.** Which colour means what, and how much of it a screen may carry.
  *Terracotta is noise (dither dots, never text); signal is the result and covers under 2%
  of a screen.*
- **Themes.** How light and dark switch, and what has to redraw.
  *CSS-only switching so the first paint is right; canvas code redraws on theme change.*

## Motion and behaviour

- **The motion vocabulary.** The few named motions the site uses, and their timing.
  *Resolve (noise to image on scroll), glitch (a 357 ms lock-on, once), field (slow
  decorative dither), all timed motion on one 14 fps clock.*
- **Rest state first.** *Complete HTML before scripts; reduced motion shows the final state.*
- **What never happens.** *Nothing moves text while someone reads; nothing depends on hover.*

## Patterns

- **Icons.** Which set, how they're included, and their accessibility.
  *One icon set inlined at build time; unknown names fail the build; always decorative next
  to a text label.*
- **Navigation on sub-pages.** *A breadcrumb, not a section menu; the `<h1>` follows it
  directly; onward links at the end.*
- **Status and labels.** *Tags, not custom callout boxes.*
- **External links.** *Same tab; the link text names the destination.*

## Safety and hygiene

- **Static-build safety.** *No request-time server, image proxy or third-party request at
  runtime; images only when the data declares them, with the cover path as the one
  deliberate convention.*
- **Comments.** *Explain why (the constraint, the measured number, the rejected
  alternative), not what.*
- **Keeping it current.** *A PR that changes a convention updates this document too.*
