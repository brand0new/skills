---
name: new-project
description: Add or update a project on a portfolio site's projects page — collect every fact from me, add the thumbnail I supply, and write the entry to match the site's content schema. Use for a `draft-project` inbox issue, or when I ask to add, change or archive a project on my site. Agent-agnostic.
---

# New project

A project entry is usually one content file (JSON, YAML or markdown) matching the site's
projects schema, plus a thumbnail. The site profile (`site-profile` skill) names the folder,
the schema and the thumbnail location. Read the schema and two existing entries before you
write.

For an inbox issue, the `content-inbox` skill comes first: it covers the trust boundary, the
claim and the closing comment.

## 1. Collect the facts

Everything about a project is a fact about something I built, so all of it comes
from me. Don't fill a gap from the project's own site or repository without asking: that's
a suggestion to put to me, not a source.

Typical fields:

| Field | Notes |
| --- | --- |
| name | as I write it |
| url | where the entry links to; it must resolve |
| description | one sentence on what it does. Tidy my wording, don't sell it |
| status | free text, my call: `WIP`, `Live`, `Archived` |
| open source | yes or no |
| thumbnail | the image I supply (step 2) |
| styling fields | accent colour, font and the like, only when I ask |

If a required field is missing from the issue, ask for exactly the missing ones in one
comment (`content-inbox` step 5).

To **update** a project, edit its existing entry and change only what I asked for.

## 2. Thumbnail

Use the image attached to the issue, in the format and size the existing thumbnails use
(prefer SVG when they do). If no image is attached, ask for one. Don't draw a logo for my
project yourself, and don't take one from the project's site without my say-so.

## 3. Write the entry

- A new project goes at the end of the order, unless I name a position. If the order
  lives in filenames, renumbering other entries to make room is fine as long as nothing
  links to the filenames.
- A custom accent colour must stay readable in every theme the site has. Check it on the
  preview in light and dark.
- A custom font only works if the site loads it. Check the site's font setup first.

## 4. Ship it

Follow `ship-change` (git-workflow plugin):

- Branch `<agent>/project-<name>`, title `content: project <name>`.
- Body: what was added or changed, and anything to look at on the preview.
- `Closes #<n>` for an inbox issue.

Then close the loop as `content-inbox` describes.
