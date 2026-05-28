---
title: Installing agent features
---

# Installing agent features

The `npx @comet/cli install-agent-features` command installs [agent skills](https://agentskills.io/) and agent rules into your project — structured, reusable instructions for AI coding agents (such as Claude Code, Cursor, or GitHub Copilot). Skills land in `.agents/skills/` and `.claude/skills/`; rules land in `.agents/rules/`, `.claude/rules/`, `.cursor/rules/`, and `.github/instructions/`. Agents pick them up automatically.

## Quick start

Add an `agent-features.json` file at the project root containing the external repos to fetch skills and rules from:

```json
{
    "repos": ["https://github.com/vivid-planet/comet.git"]
}
```

Add an `install-agent-features` script to your root `package.json`:

```json
{
    "scripts": {
        "install-agent-features": "npx @comet/cli install-agent-features"
    }
}
```

and run this script in `install.sh`:

```diff
  # ...

+ # Install agent features
+ npm run install-agent-features

  # create site-config-envs
  npm run create-site-configs-env

  # ...
```

## What is a skill?

A skill is a folder containing at minimum a `SKILL.md` file. The folder name is the skill name. For example:

```
skills/
└── code-style/
    └── SKILL.md
```

The `SKILL.md` file contains markdown-formatted instructions that the agent follows when the skill is active. This follows the [Agent Skills specification](https://agentskills.io/specification).

## What is a rule?

A rule is a markdown file inside `rules/`. The relative path from `rules/` is the rule name. Rules may be organized into subdirectories — the command walks the tree recursively and preserves the nested layout in each target directory. For example:

```
rules/
├── naming-conventions.md
├── testing-policy.md
├── backend/
│   └── api-patterns.md
└── frontend/
    └── component-structure.md
```

Rules are a lightweight complement to skills: use a rule for short, always-on guidance (a single-file set of instructions) and a skill for a larger bundle of instructions plus supporting files. Rules may begin with an optional YAML frontmatter block (see [Internal rules and skills](#internal-rules-and-skills)).

## Local skills and rules

Place skill folders inside `skills/` or `agentic-plugin/skills/` and rule files inside `rules/` at your repo root. These have the highest priority and override any same-named skills or rules from external repos. Among the local skill folders, `skills/` takes priority over `agentic-plugin/skills/`.

Then run the command to symlink them into the target directories:

```sh
npx @comet/cli install-agent-features
```

Local skills and rules are **symlinked**, so edits are reflected immediately without re-running the command.

If your repo is also used as a source by other projects, see [Internal rules and skills](#internal-rules-and-skills) to prevent local-only items from being installed by consumers.

## npm packages (node_modules)

The command automatically scans direct dependencies in `node_modules/` (including `@scoped` packages) for `skills/` and `rules/` directories and creates symlinks to the agent-specific directories. This is compatible with the [npm-based Agent Skills convention](https://github.com/antfu/skills-npm/blob/HEAD/PROPOSAL.md) and extends it to also support rules.

No additional configuration is needed — any installed npm package that ships a `skills/` or `rules/` directory at its package root will be discovered automatically. Packages without these directories are silently skipped.

For example, given a package `some-tool` with the following structure:

```
node_modules/some-tool/
├── skills/
│   └── some-tool-docs/
│       └── SKILL.md
└── rules/
    └── best-practices.md
```

After running `npx @comet/cli install-agent-features`, symlinks are created:

```
.agents/skills/some-tool-docs -> node_modules/some-tool/skills/some-tool-docs
.claude/skills/some-tool-docs -> node_modules/some-tool/skills/some-tool-docs
.agents/rules/best-practices.md -> node_modules/some-tool/rules/best-practices.md
.claude/rules/best-practices.md -> node_modules/some-tool/rules/best-practices.md
...
```

Skills and rules from `node_modules` are **symlinked** and have their internal items filtered (skills with `metadata.internal: true` in SKILL.md frontmatter are excluded). They have higher priority than external git repos but lower priority than local sources.

## External repos

You can install skills and rules from external git repositories. This allows you to consume items provided by libraries. The source repos are listed in `agent-features.json`:

```json
{
    "repos": ["https://github.com/vivid-planet/comet.git", "https://github.com/org/other-features.git#main"]
}
```

Each entry is a git URL (HTTPS or SSH), optionally followed by `#ref` to pin a branch, tag, or commit hash. Only the `skills/`, `agentic-plugin/skills/`, and `rules/` folders are fetched from each repo (via git sparse checkout) — the rest of the repository is not downloaded. External skills and rules are **copied** into the target directories.

A repo may ship any subset of `skills/`, `agentic-plugin/skills/`, and `rules/`. Missing folders are silently ignored.

Items with `metadata.internal: true` in their frontmatter are excluded when installing from external repos.

## Priority order

When the same skill or rule name exists in multiple sources, the higher-priority source wins. The priority order (highest to lowest) is:

1. **Local** — `skills/`, `agentic-plugin/skills/`, and `rules/` at the repo root
2. **npm packages** — `node_modules` dependencies
3. **External repos** — git repositories listed in `agent-features.json`

Skills and rules have separate namespaces: a skill and a rule may share a name without conflicting.

A `CONFLICT` warning is printed for each skipped item. No error is thrown — the command completes successfully.

Example output:

```
Installing 1 skill from local skills/...
  Symlinked: code-style
Installing 1 skill from node_modules some-tool (skills/)...
  Symlinked: tool-docs
Installing 2 skills from external https://github.com/vivid-planet/comet.git (skills/)...
  CONFLICT: "code-style" from external https://github.com/vivid-planet/comet.git (skills/) skipped (already installed from a higher-priority source)
  Copied: api-conventions
Installing 1 rule from local rules/...
  Symlinked: naming-conventions.md
```

## Target directories

Items are installed into:

| Directory               | Content | Used by                                      |
| ----------------------- | ------- | -------------------------------------------- |
| `.agents/skills/`       | Skills  | Most agents |
| `.claude/skills/`       | Skills  | Claude Code                                  |
| `.agents/rules/`        | Rules   | Cloud agents                                 |
| `.claude/rules/`        | Rules   | Claude Code                                  |
| `.cursor/rules/`        | Rules   | Cursor                                       |
| `.github/instructions/` | Rules   | GitHub Copilot                               |

Existing items in these directories are overwritten when an item with the same name is installed. Items not managed by the command are left untouched.

These directories should not be committed to your repository as they are created by the command during install.

## Options

| Option            | Description                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| `--config <path>` | Path to a JSON config file specifying repos to install features from (default: `agent-features.json`) |
| `--dry-run`       | Print what would be installed without making any changes                                              |

Preview what would be installed without making changes:

```sh
npx @comet/cli install-agent-features --dry-run
```

## For library maintainers: Providing features to consumers

If you maintain a library, you can provide agent skills and rules to consumers in two ways:

### Via npm package

Place `skills/` and/or `rules/` directories at the root of your published npm package. Consumers who install your package will automatically pick up these features — no extra configuration is needed on their side.

```
your-package/
├── skills/
│   └── your-library-conventions/
│       └── SKILL.md
├── rules/
│   └── naming-conventions.md
├── src/
│   └── ...
└── package.json
```

This approach is the simplest for consumers: they just install your package with `npm install` and run `install-agent-features`. Internal items (those with `metadata.internal: true`) are automatically excluded.

### Via git repository

Alternatively, you can add skills and rules to your git repository so that consumers reference it in their `agent-features.json`.

Place skill folders inside a `skills/` directory (or `agentic-plugin/skills/` if you ship them as a Claude Code plugin) and rule files inside a `rules/` directory at your repo root:

```
skills/
├── your-library-conventions/
│   └── SKILL.md
└── another-skill/
    └── SKILL.md
rules/
├── naming-conventions.md
└── testing-policy.md
```

When a consumer references your repo, `install-agent-features` will sparse-fetch only the `skills/`, `agentic-plugin/skills/`, and `rules/` folders — the rest of your repository is never downloaded. Their `agent-features.json` would look like:

```json
{
    "repos": ["https://github.com/your-org/your-library.git"]
}
```

To pin consumers to a specific release:

```json
{
    "repos": ["https://github.com/your-org/your-library.git#v2.1.0"]
}
```

Skills and rules in your `skills/` and `rules/` folders have lower priority than the consuming project's own local items. This means consumers can always override your items locally without conflict.

### Internal rules and skills

To ship items that are only relevant to contributors of your library (not consumers), set `metadata.internal: true` in the optional YAML frontmatter at the top of the file. These items will be skipped when consumers install from your repo.

For a skill, add the frontmatter to `SKILL.md`:

```markdown
---
metadata:
    internal: true
---

# My Skill

...
```

For a rule, add the frontmatter to the rule's `.md` file:

```markdown
---
metadata:
    internal: true
---

# My Rule

...
```
