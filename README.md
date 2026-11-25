# skills

Brandon Verzuu's skills toolkit, published as a Claude Code plugin marketplace. Each plugin
groups the skills for one kind of work. The skills are plain `SKILL.md` procedures, so any
agent that reads skills can use them, not only Claude Code.

## Install in Claude Code

```
/plugin marketplace add brand0new/skills
/plugin install git-workflow@brand0new
/plugin install writing@brand0new
/plugin install portfolio-site@brand0new
```

To update later, run `/plugin marketplace update brand0new`, then restart Claude Code.

## Plugins

### git-workflow

Shipping changes through pull requests on any repository.

| Skill | What it does |
| --- | --- |
| `ship-change` | Branch, commit, local build, PR, checks, squash-merge and clean-up |
| `workspace-cleanup` | Remove build output, finished worktrees and squash-merged branches |

### writing

Writing and editing in Brandon's voice, with the checks that keep a ghostwritten piece honest.

| Skill | What it does |
| --- | --- |
| `my-writing-style` | His voice, condensed, with the full measured style guide as a reference |
| `ghostwrite` | Note → outline and questions → researched, self-critiqued, fact-checked draft |
| `fact-check` | Primary-source research, claim tracing and a bundled link checker |
| `fingerprint-scrub` | A bundled deterministic scrub against his corpus norms |
| `social-post` | The LinkedIn post announcing a published piece, for him to post |

The bundled scripts need Node 18 or later and nothing else.

### portfolio-site

Developing and maintaining a personal portfolio site. Every skill reads the site's
**site profile** (a short section in its `AGENTS.md`, set up by `site-profile`), so the same
skills work on any site.

| Skill | What it does |
| --- | --- |
| `site-profile` | Find or write the profile: content paths, schema, build, owner, merge rights |
| `content-inbox` | Issue-driven inbox: trust boundary, labels as state, routing |
| `publish-article` | Note to live article, using `ghostwrite` and `ship-change` |
| `new-bookmark` | Add a link with a clean URL and a factual label |
| `new-project` | Add or update a project entry from the owner's facts |
| `new-component` | Add a component that follows the site's conventions |
| `article-cover` | Source, license, crop and treat an article's cover |
| `article-explainer` | A looping animated explainer video for a technical article |

`publish-article` uses the `writing` and `git-workflow` plugins, so install those too.

## Adding a plugin

1. Create `plugins/<name>/.claude-plugin/plugin.json` and one folder per skill under
   `plugins/<name>/skills/`, each with a `SKILL.md`.
2. Add the plugin to `.claude-plugin/marketplace.json`.
3. List it in this README.

Keep skills agent-agnostic and free of one project's paths: put what varies per project in
that project's own docs, the way `site-profile` does.
