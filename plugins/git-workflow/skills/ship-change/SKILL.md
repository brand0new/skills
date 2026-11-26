---
name: ship-change
description: Take a change from a branch to production through a pull request — branch and commit naming, the local build, opening the PR, waiting for CI and preview checks, squash-merging and cleaning up. Use for any change that will land on a repository's default branch (code, content or docs), and whenever another skill says to "ship it". Agent-agnostic.
---

# Ship a change

This procedure fits any repository where the default branch is what deploys, so merging a
PR is the publish step. Read the repository's own docs first (`AGENTS.md`, `CLAUDE.md`,
`CONTRIBUTING.md`, the README): where they set a rule, that rule wins over a default here.

## 0. Learn the repository

Find these once per repository, and reuse them for the rest of the run:

| What | Where to look |
| --- | --- |
| Default branch | `gh repo view --json defaultBranchRef -q .defaultBranchRef.name` |
| Build command | the repo docs, then `package.json` scripts (`build`, `generate`, `check`), a `Makefile`, or the CI workflow's steps |
| Required checks | the branch protection (`gh api repos/{owner}/{repo}/branches/<default>/protection`), or the workflows under `.github/workflows/` |
| Preview deployments | a hosting app's check on recent PRs (Cloudflare Pages, Vercel, Netlify) |
| Commit and branch conventions | the repo docs, then `git log --oneline -20` |

## 1. Branch

- Work on a branch, never directly on the default branch. When several agents work at
  once, give each task its own git worktree so they don't share a checkout.
- Name it `<agent-or-area>/<short-kebab-description>`, for example
  `claude/fix-login-redirect` or `design/equal-card-heights`, unless the repo has its own
  pattern.

## 2. Commit

- Title: `area: summary`. `area` is a short type such as `feat`, `fix`, `content`,
  `design`, `a11y`, `seo`, `docs`, `chore` or `deps`, or the name of the skill that
  produced the change. Follow the repo's own list when it has one.
- Explain why in the body when the diff doesn't make it obvious.

## 3. Build locally

Install from the lockfile and run the build CI runs (for example `npm ci` and
`npm run build`). It must pass before you open the PR: it catches the schema
violations, broken links and type errors CI would catch, only sooner.

## 4. Open the PR

- Target the default branch, with the same `area: summary` style for the title.
- Body: what changed and why. Mention anything a reviewer can only check by looking at it.
- Link an issue it resolves with `Closes #<n>`.

## 5. Wait for checks

Watch them with `gh pr checks <n> --watch`. Typically there are two kinds:

- **The build check** (GitHub Actions or similar) proves the build passes on a clean
  runner. It's usually **required**: the merge stays blocked until it's green.
- **The preview check** from the hosting provider links to a preview deployment. Open it
  for anything visual.

If a check fails, don't merge. Say what failed on the PR, fix it on the branch and push
again. Never bypass a red check, and never merge around branch protection.

## 6. Merge

- Squash-merge, so the default branch gets one commit whose title carries the PR number,
  unless the repo prefers another strategy.
- Delete the remote branch.
- Confirm the deploy: the hosting check on the merge commit, or the live page.

Whether an agent may merge its own PR without a human is a question of autonomy, not of
procedure. The repo's docs decide it. When they're silent, open the PR and leave the merge
to a human.

## 7. Clean up

Run the `workspace-cleanup` skill for the worktree and local branch you used.
