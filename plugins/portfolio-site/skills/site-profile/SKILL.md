---
name: site-profile
description: Find or write the site profile of a personal portfolio site — the short section in its AGENTS.md that tells every portfolio-site skill where content lives, which schema validates it, how the site builds and deploys, who owns the content inbox and what an agent may merge on its own. Use before running any other portfolio-site skill in a repository for the first time, when a skill can't find a path it needs, or when asked to set a site up for these skills. Agent-agnostic.
---

# Site profile

The portfolio-site skills describe *how* to do the work on any personal site. The site
profile says *where*, for one particular site. Every other skill in this plugin reads it
first, so none of them hard-codes a path.

## Where it lives

A `## Site profile` section in the repository's `AGENTS.md` (or `CLAUDE.md` if the repo only
has that). Agents of every kind read that file, which keeps the profile agent-agnostic.

## 1. Look for it

Read the section if it exists, and check that the paths in it still exist. If it's there
and current, you're done: go back to the skill that sent you.

## 2. Derive it

If there's no profile, or it's stale, work it out from the repository. Look at the
framework config (`astro.config.*`, `nuxt.config.*`, `next.config.*`), the content
config or schemas (`src/content.config.ts`, `content.config.ts`), `package.json` scripts,
`.github/workflows/`, and the existing content. Fill in what applies and leave out what the
site doesn't have:

```markdown
## Site profile

Read by the portfolio-site skills.

- **Owner**: `<my-github-login>`, the only account whose issues and comments count
- **Site URL**: https://example.com
- **Default branch**: `main`, deployed by <host> on every push
- **Build**: `npm ci && npm run build` (the same command CI runs)
- **Dev server**: `npm run dev`
- **Agent may merge its own PRs**: yes, once required checks pass / no, a human merges
- **Articles**: `src/content/articles/<slug>.md`, schema `articles` in `src/content.config.ts`
  - Tags: reuse the existing ones (list them, or say where to find them)
- **Voice guide**: `<path to VOICE.md>`, when it isn't at the repo root or `~/.agents/voice/`
- **Covers**: `public/articles/<slug>/cover.png`, 1200×630, made with `npm run cover:generate`
- **Explainers**: `npm run explainer:render`, docs in `scripts/explainers/README.md`
- **Bookmarks**: `src/content/bookmarks.yml` (`url`, `label`)
- **Projects**: `src/content/projects/<n>.<name>.json`, thumbnails in `public/projects/`
- **Components**: `src/components/`, conventions in `<path to conventions doc>`
- **Design tokens**: `<tokens file>`, contrast checked by `<command>`
- **Content inbox labels**: `draft-article`, `draft-bookmark`, `draft-project`
- **Link checker / fingerprint scrub**: the repo's own scripts if it has them, otherwise
  the writing plugin's bundled ones
```

Ask me for what you can't derive, above all the merge autonomy: never assume an
agent may merge.

## 3. Save it

Add or update the section in `AGENTS.md` and ship that change on its own with the
`ship-change` skill (git-workflow plugin), title `docs: site profile`. A profile only in
your memory helps nobody after this run.
