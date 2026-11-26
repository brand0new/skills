---
name: article-explainer
description: Write and render a short, silent, looping animated explainer video for a technical article on a portfolio site — one idea told in about six scenes with burned-in captions, reviewed as stills, rendered to MP4/WebM with a poster and alt text, plus an optional 4:5 cut for LinkedIn. Use when adding or changing an article's explainer, or when cutting a feed version of one. Agent-agnostic.
---

# Article explainer

A silent, looping video at the top of an article that tells one idea in about six scenes:
the mechanism the article explains, with a clear before and after. It works for
specifications, tools, architectures and processes with steps. Reflective pieces don't get
one.

The site profile (`site-profile` skill) names the site's explainer renderer and its docs. A
typical renderer draws each frame in a headless browser (Playwright and Chromium) and
encodes the frames with `ffmpeg`. Read the renderer's README before you write a story.

**The explainer must never hold an article back.** If it can't be rendered where you're
running (no `ffmpeg`, no Chromium, fonts unreachable), ship the article without it and say
that it's still owed.

## 0. Prerequisites

- The site's dependencies (`npm ci` or equivalent).
- A headless Chromium (`npx playwright install chromium`).
- `ffmpeg` on your PATH.
- The site's fonts, reachable or installed locally. A render should fail rather than fall
  back to another typeface, so a missing font is a stop, not a warning.

## 1. Write the story

Copy an existing story as the starting point, then:

- **Six scenes, one idea per scene.** If a scene needs two captions, it's two scenes.
- **Captions stay up at least four seconds** and are short enough to read in that time.
- **Keep content inside the safe area** the renderer documents, so the feed crop doesn't
  cut it.
- **End on a before-and-after frame** that holds the whole idea in one picture: it's what
  people see when the loop restarts.
- Use the site's tokens and motion vocabulary, so the video looks like the site.
- Add the story to the renderer's list of stories, if it keeps one.

## 2. Review stills while you work

Render a handful of stills at chosen timestamps into a scratch folder, and look at them.
Iterate until each scene reads on its own, without the one before it.

## 3. Final render

Render the article's video into its public asset folder: usually an MP4 (H.264, the most
compatible), a WebM (smaller) and a poster PNG. Add the video and poster fields the article
schema has, and **write the alt text by hand**. The captions are burned into the video, so
the alt text is the screen-reader description of the whole story.

## 4. Optional: feed cut

For sharing, render a 4:5 version (1080×1350 is LinkedIn's preferred feed size) to a
git-ignored output folder. It's uploaded by hand and never goes into the site's public
assets.

## 5. Check it

Run the dev server and open the article. Check that the video loops cleanly, that the poster
shows with reduced motion turned on, that it doesn't autoplay sound (it has none), and that
the commit contains every rendered file.
