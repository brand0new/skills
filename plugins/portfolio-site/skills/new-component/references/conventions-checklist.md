# Conventions checklist

What a portfolio site's component conventions document should settle. Use it to write one for
a site that has none, or to spot gaps in one that exists. Each item is a question the document
should answer. The *italic* lines are examples of answers a site might give, not
recommendations.

## Building blocks

- **Component model.** Which framework, rendered where, and when JavaScript ships.
  *Components render at build time; a script ships only when a component has behaviour.*
- **Presentational or data-aware.** Which components may query content themselves.
  *Presentational by default: the page fetches. Only page-level sections may query.*
- **Look driven by data.** Where per-item styling comes from.
  *From content fields (an accent colour on a project), never from a per-slug class.*
- **Where shared logic lives.** *Pure helpers in `src/lib/`; algorithms shared with build
  scripts in one place, with the source named in a comment when ported.*

## Visual grammar

- **Layout primitives.** Rows, cards, panels: which one for what, and what's never used.
  *Rows for lists, panels for items with their own image; no shadows or gradients.*
- **Typefaces and their jobs.** *One face for titles, one for reading, one for labels and
  metadata.*
- **Colour tokens.** The token names, where they're defined, and how contrast is checked.
  *Custom properties generated from one tokens file; text pairs checked for WCAG AA in every
  theme during the build.*
- **Colour roles.** Which colour means what, and how much of it a screen may carry.
  *The accent colour marks one thing per screen.*
- **Themes.** How light and dark switch, and what has to redraw.
  *CSS-only switching so the first paint is right; canvas code redraws on theme change.*

## Motion and behaviour

- **The motion vocabulary.** The few named motions the site uses, and their timing.
  *One entrance motion on scroll, one confirmation motion, nothing on a timer.*
- **Rest state first.** *Complete HTML before scripts; reduced motion shows the final state.*
- **What never happens.** *Nothing moves text while someone reads; nothing depends on hover.*

## Patterns

- **Icons.** Which set, how they're included, and their accessibility.
  *One icon set inlined at build time; always decorative, next to a text label.*
- **Navigation on sub-pages.** *A breadcrumb, then the `<h1>`; onward links at the end.*
- **Status and labels.** *Small tags, not custom callout boxes.*
- **External links.** *Same tab or new tab, and how the link text names the destination.*

## Safety and hygiene

- **Static-build safety.** *No request-time server, image proxy or third-party request at
  runtime; images only when the data declares them.*
- **Comments.** *Explain why (the constraint, the measured number, the rejected alternative),
  not what.*
- **Keeping it current.** *A PR that changes a convention updates this document too.*
