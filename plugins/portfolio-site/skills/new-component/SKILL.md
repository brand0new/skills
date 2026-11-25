---
name: new-component
description: Add or substantially rework a UI component on a personal portfolio site so it follows the site's own conventions — placement, props, design tokens, motion, accessibility, both themes and static-build safety. Use when creating or reworking anything in the site's components folder, in any framework (Astro, Vue, Svelte, React). Agent-agnostic.
---

# New component

A portfolio site has a visual language, written down or not. A new component either speaks
it or quietly erodes it. This procedure finds the language first and then applies it. The
pseudo-code below is a decision template, not literal code: walk it top to bottom.

## 0. Find the conventions

The site profile (`site-profile` skill) names the components folder and the conventions
document. Read the conventions document first.

If the site has none, read three or four existing components, then the global stylesheet
and the token file, and write down what they agree on using
[references/conventions-checklist.md](references/conventions-checklist.md). Propose that
document to the owner as part of this PR: the next component shouldn't have to rediscover
it.

## 1. Classify it

```
kind = classify(component):
  "list"        several content items as links     → copy the site's existing list or row component
  "panel"       one item with its own image/fields → copy the existing card or panel
  "section"     a page section that reads content  → copy an existing homepage/page section
  "media"       an image, video or canvas          → copy the existing media/cover component
  "decorative"  a texture or ornament, no content  → reuse the site's decorative helper if any
  "glyph"       a generated, decorative mark       → copy the existing icon/glyph component
  "chrome"      header, footer, nav, theme toggle  → edit the layout, not a new component

file = <components folder>/<PascalCaseNoun>.<ext>
```

If nothing existing fits, say so in the PR and explain the new pattern you introduced.

## 2. Props and data

```
header comment: what it's for, which sibling it mirrors, any constraint the code doesn't show

props:
  domain objects, named for the domain (articles, project), reusing the types the data has
  presentation knobs only beyond that (size, variant), with defaults

if kind == "section":
  may query content through the site's content helpers
else:
  NO content queries. The page passes what you render.

shared logic → the site's lib/utils folder, as pure functions
```

## 3. Markup and styles

```
markup:
  semantic element first (ul/ol of links, section with aria-labelledby, figure, nav)
  reuse the global classes for rows, labels and tags rather than restyling them
  every decorative element: aria-hidden="true"
  every interactive element: reachable and operable by keyboard, with a visible focus state

styles (scoped):
  colours: design tokens only, never a raw hex
  type: the site's font variables and type scale
  layout works at 390px wide with no horizontal page scroll
  any transition or animation is off under prefers-reduced-motion
```

## 4. Behaviour, only if it has any

```
the HTML is complete before any script runs; the script upgrades it (progressive enhancement)
redraw on theme change; read colours from tokens at runtime, not from constants
if reduced motion: show the final state once, no animation loop
animate only while on screen (IntersectionObserver)
no hover-only affordances: anything hover reveals is reachable another way
```

## 5. Colour and contrast

```
for each colour you add:
  add it to the token file, for every theme
  if text sits on it, or it's a focus ring or meaningful mark:
    check WCAG AA contrast in every theme (4.5:1 text, 3:1 large text and non-text)
    add the pair to the site's contrast check, if it has one
```

## 6. Static-build checks

```
assert nothing needs a server, an image proxy or a third-party request at runtime
  (unless the site is deliberately server-rendered)
assert every image is rendered only when its data declares it; no guessed asset paths
run the build; open the page in every theme, at phone width, and with reduced motion on
```

## 7. Ship it

- PR title `design: <summary>` for visual work, `feat: <summary>` for new behaviour. Ship it
  with `ship-change` (git-workflow plugin).
- If the component changes a convention, update the conventions document in the same PR.
