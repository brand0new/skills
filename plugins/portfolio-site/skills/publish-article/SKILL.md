---
name: publish-article
description: Turn a captured note into a published article on a personal portfolio site — ghostwritten draft, frontmatter that matches the site's content schema, images, cover, optional explainer, PR, merge and a post to share. Use for a `draft-article` inbox issue, or when the owner pastes raw note text and asks for it to become an article or blog post on their site. Agent-agnostic.
---

# Publish an article

Takes a raw note to a live article: an outline the owner agrees to, a full draft in their
voice, a cover, an explainer where the piece is technical, a merged PR and a post for them
to share. On a static site, a merged PR is the only publish step.

This skill leans on two other plugins from the same marketplace:

- **writing**: `ghostwrite` writes the draft (with `fact-check` and `fingerprint-scrub`), and
  `social-post` writes the announcement. If the owner isn't Brandon, use their own voice
  guide instead of `my-writing-style`, and follow the same procedure.
- **git-workflow**: `ship-change` takes the article through the PR.

Read the site profile first (`site-profile` skill). It names the articles folder, the
schema, the cover convention, the voice examples and whether an agent may merge.

## Inbox protocol

For a `draft-article` issue, the `content-inbox` skill comes first: the trust boundary, the
claim, how to ask and how to close. An article takes **two runs**, with the owner's reply in
between:

| Run | Starts when | Does | Ends with |
| --- | --- | --- | --- |
| Outline | the note arrives | step 1 | an outline and questions on the issue, `needs-input` |
| Article | the owner replies | steps 2 to 8 | a merged PR, a post to share, a closed issue |

A note pasted into a chat, with no issue, goes through the same steps. The outline goes to
the owner in the chat instead, and nothing is skipped: not the research, not the
fact-check, not the cover.

## Procedure

1. **Outline.** Follow `ghostwrite` steps 1 and 2. Besides what that skill asks, say in the
   outline whether you'll make an **explainer** (step 6). Post it on the issue, add
   `needs-input`, remove `in-progress` and stop. Don't open a PR yet.

2. **Draft.** Fold in the reply and follow `ghostwrite` steps 3 to 8: research, draft,
   self-critique, fingerprint scrub, fact-check. Use the profile's voice examples as the
   articles to read in full. Keep the hand-over lists: they become the PR body.

3. **Frontmatter.** Match the site's article schema exactly: a missing or mistyped field
   fails the build. Copy the shape of a recent article, then check each field against the
   schema. Rules that hold on most sites:
   - **date**: the day the note was captured (the issue's creation date), not today's.
   - **slug**: kebab-case, and the filename must match it when the route resolves by file
     path.
   - **description**: one or two full sentences, 120 to 200 characters, written for search
     results and social cards. Never empty.
   - **image**: leave the key out unless the cover actually exists at that path. A pointer
     to a missing file breaks social previews.
   - **tags**: reuse the existing vocabulary before minting a new tag. Prefer an existing
     tag to a near-synonym.
   - **draft or published flag**: the PR is the gate, not the flag. A future date doesn't
     schedule anything either: the article is live the moment the PR merges. If the owner
     wants it out later, leave the PR open and merge it on that day.

4. **Images.** Download images attached to the issue to the article's public asset folder
   and reference them with root-relative paths. Custom markdown blocks the site supports
   (pull quotes, sidenotes, highlights) are the owner's choice, not decoration: don't add
   them unless the note marks them.

5. **Cover.** Not optional, ever, including for a note pasted in chat with no issue: that's
   the case most likely to get missed. Follow `article-cover`.

6. **Explainer, for a technical article.** If the piece explains a mechanism (a
   specification, a tool, an architecture, a process with steps) and the site has an
   explainer renderer, follow `article-explainer`. A reflective or personal piece doesn't
   get one, and neither does an idea with no before and after to draw. The explainer must
   never hold the article back: if it can't be rendered where you're running, ship without
   it and say on the issue that it's still owed.

7. **Ship it.** Follow `ship-change`, with:
   - Branch `<agent>/article-<slug>`, title `article: <title>`.
   - Body: the `ghostwrite` hand-over (summary, word count, **What I added**, **Sources**,
     **Corrections**) and `Closes #<n>`.
   - No TODO list of open questions. Missing facts were settled on the issue, so by the time
     a PR exists there's nothing left to ask.

   Wait for the checks in the same run, and merge when the required ones pass, if the
   profile allows it. If a check fails, don't merge: `content-inbox` step 7 says what to
   leave behind.

8. **Share it and close the loop.** Once the page is live, draft the post with
   `social-post` and put it on the issue with the live URL and the merged PR. Then close the
   issue as `content-inbox` step 6 describes.
