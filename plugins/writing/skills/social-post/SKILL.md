---
name: social-post
description: Draft the LinkedIn post that announces a newly published article or piece of Brandon's, in his voice, and hand it to him to post himself. Use after an article is live (for example once its PR has merged), or when he asks for a post to share something he published. Agent-agnostic.
---

# Social post

Publishing doesn't end at the merge: a piece needs to be told about. The agent writes the
post and Brandon sends it. **Never post it yourself**, on any account or through any tool,
even when one is available. A post under his name goes out by his hand.

## 1. Wait until it's live

Draft only once the piece is published and its URL answers with a 200. A static host can take
a minute or two after a merge. A post that links to a 404 is worse than a late one.

## 2. Write it

- **Language** matches the piece: a Dutch article gets a Dutch post.
- **Voice** is his, from the `my-writing-style` skill: first person, plain, a little
  self-deprecating. The anti-patterns there apply even more here, because a feed is where
  readers know them best.
- **Nothing new.** The post may only say what the piece says. No extra claim, number or
  anecdote, and no opinion the piece doesn't hold.
- **The opening lines do the work.** The feed cuts a post off after the first few lines, so
  the reason to read on has to be there: the question the piece asks, or the observation it
  starts from. Not "I wrote a new article".
- **Shape**: 80 to 150 words, short paragraphs with blank lines between them, and the link on
  its own line at the end. No bullet list of takeaways, no call for comments, no emoji
  opener.
- **Hashtags**: at most three, taken from the piece's tags, on the last line.

If the piece has an animated explainer, add one line under the draft noting that a 4:5 feed
cut can be rendered for it (portfolio-site's `article-explainer` skill). The video is
uploaded by hand.

## 3. Hand it over

Put the post in a fenced code block, so it copies cleanly from a phone, and keep everything
around it to a line or two. Give it where the work was requested: on the originating issue
when there is one (in the same comment that reports the merge, or right after it),
otherwise in the chat.

Small items such as bookmarks or project updates don't get a post unless he asks.
