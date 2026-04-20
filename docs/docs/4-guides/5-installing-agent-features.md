---
title: Installing agent features
---

# Installing agent features

The `npx @comet/cli install-agent-features` command installs [agent skills](https://agentskills.io/) and agent rules into your project — structured, reusable instructions for AI coding agents (such as Claude Code, Cursor, or GitHub Copilot). Skills land in `.agents/skills/` and `.claude/skills/`; rules land in `.agents/rules/`, `.claude/rules/`, `.cursor/rules/`, and `.github/instructions/`. Agents pick them up automatically.

:::note
The previous `install-agent-skills` command is deprecated. It still works, but projects should migrate to `install-agent-features` with an `agent-features.json` config.
:::

## Quick start

Add an `agent-features.json` file at the project root containing the external repos to fetch skills and rules from:

```json
{
    "repos": ["git@github.com:vivid-planet/comet.git"]
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

A rule is a single markdown file inside `rules/`. The filename (including `.md`) is the rule name. For example:

```
rules/
├── naming-conventions.md
└── testing-policy.md
```

Rules are a lightweight complement to skills: use a rule for short, always-on guidance (a single-file set of instructions) and a skill for a larger bundle of instructions plus supporting files. Rules may begin with an optional YAML frontmatter block (see [Internal rules and skills](#internal-rules-and-skills)).

## Local skills and rules

Place skill folders inside `skills/` and rule files inside `rules/` at your repo root. These have the highest priority and override any same-named skills or rules from external repos.

Then run the command to symlink them into the target directories:

```sh
npx @comet/cli install-agent-features
```

Local skills and rules are **symlinked**, so edits to `skills/` and `rules/` are reflected immediately without re-running the command.

If your repo is also used as a source by other projects, see [Internal rules and skills](#internal-rules-and-skills) to prevent local-only items from being installed by consumers.

## External repos

You can install skills and rules from external git repositories. This allows you to consume items provided by libraries. The source repos are listed in `agent-features.json`:

```json
{
    "repos": ["git@github.com:vivid-planet/comet.git", "git@github.com:org/other-features.git#main"]
}
```

Each entry is an SSH git URL, optionally followed by `#ref` to pin a branch, tag, or commit hash. Only the `skills/` and `rules/` folders are fetched from each repo (via git sparse checkout) — the rest of the repository is not downloaded. External skills and rules are **copied** into the target directories.

A repo may ship just `skills/`, just `rules/`, or both. Missing folders are silently ignored.

Items with `metadata.internal: true` in their frontmatter are excluded when installing from external repos.

## Priority order

When the same skill or rule name exists in multiple sources, the higher-priority source wins. Local always takes priority over external.

Skills and rules have separate namespaces: a skill and a rule may share a name without conflicting.

A `CONFLICT` warning is printed for each skipped item. No error is thrown — the command completes successfully.

Example output:

```
Installing 1 skill from local skills/...
  Symlinked: code-style
Installing 2 skills from external git@github.com:vivid-planet/comet.git (skills/)...
  CONFLICT: "code-style" from external git@github.com:vivid-planet/comet.git (skills/) skipped (already installed from a higher-priority source)
  Copied: api-conventions
Installing 1 rule from local rules/...
  Symlinked: naming-conventions.md
```

## Target directories

Items are installed into:

| Directory               | Content | Used by                                      |
| ----------------------- | ------- | -------------------------------------------- |
| `.agents/skills/`       | Skills  | Cloud agents (e.g. GitHub Copilot Workspace) |
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

If you maintain a library, you can add agent skills and rules to your repository so that projects using your library can pull them in via `agent-features.json`.

Place skill folders inside a `skills/` directory and rule files inside a `rules/` directory at your repo root:

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

When a consumer references your repo, `install-agent-features` will sparse-fetch only the `skills/` and `rules/` folders — the rest of your repository is never downloaded. Their `agent-features.json` would look like:

```json
{
    "repos": ["git@github.com:your-org/your-library.git"]
}
```

To pin consumers to a specific release:

```json
{
    "repos": ["git@github.com:your-org/your-library.git#v2.1.0"]
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

## Deprecated: `install-agent-skills`

The previous `install-agent-skills` command still works and reads `agent-skills.json` by default, but it only installs skills and prints a deprecation warning. Migrate by:

1. Renaming `agent-skills.json` to `agent-features.json` (or adding a new file — the schema is identical).
2. Replacing the `install-agent-skills` script in `package.json` and `install.sh` with `install-agent-features`.

No changes are required to existing `skills/` folders or external-repo `skills/` contents.
