---
name: article-cover
description: Produce the cover image for an article on a portfolio site — find a source image the site may legally use, crop it to the social-card ratio, run it through the site's cover treatment, record attribution and wire it into the frontmatter. Use whenever an article is added or its cover changes, including articles written outside the publish-article pipeline. Agent-agnostic.
---

# Article cover

Every article has a cover. It's the card image on listing pages, often the hero on the
article itself, and the image social networks show when the link is shared. A missing cover
leaves a hole in all three places.

The site profile (`site-profile` skill) names where covers live, their size, and the
command or script that applies the site's treatment (a duotone, a dither, a colour wash).
Without a treatment, the cover is the cropped source image as is.

## 1. Find a source image

Use one of these, in order:

1. An image attached to the originating issue, or one I supply.
2. An openly licensed image (Wikimedia Commons, Openverse, Unsplash). Search with a one-word
   summary of the article's topic, plus its most relevant tag if that's too broad. Pick a
   picture with strong shapes and clear tonal range when the site's treatment reduces
   detail (dithers and duotones do).

For an open-licence image, record the author, the licence (SPDX id or name) and the page you
found it on. Don't use anything without a licence that allows reuse. Never use an image
generated to look like a photo of a real person, place or event.

If none of those hosts is reachable (sandboxed agents are often blocked from them), ask me
for a picture rather than drawing a vector stand-in. Flat shapes have no tonal range
and look broken under most treatments.

## 2. Crop and prepare

Covers are usually 1200×630 (the Open Graph ratio, 1.91:1). Don't trust a script to choose
the crop: if the subject isn't centred, or the source isn't at the output ratio, crop it
yourself first so the cover shows exactly what you intend.

- Read the source's real pixel size before computing a crop (with `sharp`, from
  `metadata()`). An image previewed in a chat may be downscaled.
- If the treatment works on luminance (dithers, duotones), dark or low-contrast areas go
  solid. Lift them first (for example with `sharp`:
  `.grayscale().normalise().linear(1.5, 45)`) and look at the result before committing it.
- Social cards often put the title over one side of the image. Keep the subject away from
  that side.

## 3. Generate

Run the site's cover command on the prepared image. If the site keeps both a light and a
dark variant, generate both. Leave the script's experimental options at their defaults for
real covers, so every card matches.

## 4. Wire it into the article

- Point the frontmatter image field at the cover, using the exact path convention the
  site's components expect. Some sites derive sibling files (a light variant, a social
  card) from that path.
- Add the attribution fields the schema offers (author, licence, source URL) whenever the
  licence asks for credit. CC BY and most others do.
- Commit every generated file.

## 5. Check it

Run the dev server and look at the article and the listing page in every theme. The cover
should read as a picture, not as noise, and the credit line should show where one is needed.
If the site generates social cards, open the one for this article too.
