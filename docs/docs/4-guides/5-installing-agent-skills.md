---
title: Installing agent skills
---

# Installing agent skills

The `npx @comet/cli install-agent-skills` command installs [agent skills](https://agentskills.io/) into your project — structured, reusable instructions for AI coding agents (such as Claude Code or GitHub Copilot). Skills are placed into `.agents/skills/` and `.claude/skills/`, where agents pick them up automatically.

## Quick start

Add an `agent-skills.json` file at the project root containing the external repos to fetch skills from:

```json
{
    "repos": ["git@github.com:comet-dxp/comet.git"]
}
```

Add an `install-agent-skills` script to your root `package.json`:

```json
{
    "scripts": {
        "install-agent-skills": "npx @comet/cli install-agent-skills"
    }
}
```

and run this script in `install.sh`:

```diff
  # ...

+ # Install agent skills
+ npm run install-agent-skills

  # create site-config-envs
  npm run create-site-configs-env

  # ...
```

## What is a skill?

A skill is a folder containing at minimum a `SKILL.md` file. The folder name is the skill name. For example:

```
project-skills/
└── code-style/
    └── SKILL.md
```

The `SKILL.md` file contains markdown-formatted instructions that the agent follows when the skill is active. This follows the [Agent Skills specification](https://agentskills.io/specification).

## Adding project-specific skills

Place skill folders inside `project-skills/` at your repo root. These have the highest priority and override any same-named skills from external repos.

```
project-skills/
└── code-style/
    └── SKILL.md
```

Then run the `install-agent-skills` command to symlink them into the target directories:

```sh
npx @comet/cli install-agent-skills
```

Local skills are **symlinked**, so edits to `project-skills/` are reflected immediately without re-running the command.

## External repos

You can install skills from external git repositories. This allows you to consume skills provided by libraries. The source repos are listed in `agent-skills.json`:

```json
{
    "repos": ["git@github.com:comet-dxp/comet.git", "git@github.com:org/other-skills.git#main"]
}
```

Each entry is an SSH git URL, optionally followed by `#ref` to pin a branch, tag, or commit hash. Only the `package-skills/` folder is fetched from each repo (via git sparse checkout) — the rest of the repository is not downloaded. External skills are **copied** into the target directories.

## Priority order

When the same skill name exists in multiple sources, the higher-priority source wins:

| Priority | Source         | Location                                  | Install method |
| -------- | -------------- | ----------------------------------------- | -------------- |
| 1        | Project skills | `project-skills/` at repo root            | Symlink        |
| 2        | Package skills | `package-skills/` at repo root            | Symlink        |
| 3        | External repos | Configured via `agent-skills.json`        | Copy           |

A `CONFLICT` warning is printed for each skipped skill. No error is thrown — the command completes successfully.

Example output:

```
Installing 1 skill(s) from local project-skills/...
  Symlinked: code-style
Installing 2 skill(s) from external git@github.com:comet-dxp/comet.git (package-skills/)...
  CONFLICT: "code-style" from external git@github.com:comet-dxp/comet.git (package-skills/) skipped (already installed from a higher-priority source)
  Copied: api-conventions
```

## Target directories

Skills are installed into:

| Directory         | Used by                                      |
| ----------------- | -------------------------------------------- |
| `.agents/skills/` | Cloud agents (e.g. GitHub Copilot Workspace) |
| `.claude/skills/` | Local IDE agents (e.g. Claude Code)          |

Existing skills in these directories are overwritten when a skill with the same name is installed. Skills not managed by the command are left untouched.

These directories should not be committed to your repository as they are created by the `install-agent-skills` command during install.

## Options

| Option            | Description                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------- |
| `--config <path>` | Path to a JSON config file specifying repos to install skills from (default: `agent-skills.json`) |
| `--dry-run`       | Print what would be installed without making any changes                                 |

Preview what would be installed without making changes:

```sh
npx @comet/cli install-agent-skills --dry-run
```

## For library maintainers: Providing skills to consumers

If you maintain a library, you can add agent skills to your repository so that projects using your library can pull them in via `agent-skills.json`.

Place skill folders inside a `package-skills/` directory at your repo root:

```
package-skills/
├── your-library-conventions/
│   └── SKILL.md
└── another-skill/
    └── SKILL.md
```

When a consumer references your repo, `install-agent-skills` will sparse-fetch only the `package-skills/` folder — the rest of your repository is never downloaded. Their `agent-skills.json` would look like:

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

Skills bundled in `package-skills/` have lower priority than the consuming project's own `project-skills/`. This means consumers can always override your skills locally without conflict.
