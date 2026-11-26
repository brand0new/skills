---
name: social-post
description: Draft the social media post (LinkedIn by default) that announces a newly published article or piece of mine, in my voice, and hand it to me to post myself. Use after an article is live (for example once its PR has merged), or when I ask for a post to share something I published. Agent-agnostic.
---

# Social post

Publishing doesn't end at the merge: a piece needs to be told about. You write the post, and I
send it. **Never post it yourself**, on any account or through any tool, even when one is
available. A post under my name goes out by my hand.

## 1. Wait until it's live

Draft only once the piece is published and its URL answers with a 200. A static host can take
a minute or two after a merge. A post that links to a 404 is worse than a late one.

## 2. Write it

- **Network**: LinkedIn unless I name another. Adjust the length and hashtag habits to the
  network I name.
- **Language** matches the piece.
- **Voice** is mine, from my voice guide (the `my-writing-style` skill). Its anti-patterns
  apply even more here, because a feed is where readers know them best.
- **Nothing new.** The post may only say what the piece says. No extra claim, number or
  anecdote, and no opinion the piece doesn't hold.
- **The opening lines do the work.** The feed cuts a post off after the first few lines, so
  the reason to read on has to be there: the question the piece asks, or the observation it
  starts from. Not "I wrote a new article".
- **Shape**: 80 to 150 words, short paragraphs with blank lines between them, and the link on
  its own line at the end. No bullet list of takeaways, no call for comments, no emoji opener.
- **Hashtags**: at most three, taken from the piece's tags, on the last line.

If the piece has an animated explainer, add one line under the draft noting that a 4:5 feed
cut can be rendered for it (portfolio-site's `article-explainer` skill). I upload video by
hand.

## 3. Hand it over

Put the post in a fenced code block, so it copies cleanly from a phone, and keep everything
around it to a line or two. Give it where the work was requested: on the originating issue
when there is one (in the same comment that reports the merge, or right after it), otherwise
in the chat.

Small items such as bookmarks or project updates don't get a post unless I ask.
