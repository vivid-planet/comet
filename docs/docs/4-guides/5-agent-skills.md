---
title: Agent Skills
---

# Agent Skills

Comet provides a mechanism to distribute and install *agent skills* — structured, reusable instructions for AI coding agents (such as Claude Code or GitHub Copilot). Skills are installed into `.agents/skills/` and `.claude/skills/` at the project root, where agents pick them up automatically.

## What Is a Skill?

A skill is a **folder** containing at minimum a `SKILL.md` file. The folder name is the skill name. For example:

```
package-skills/
└── my-skill/
    └── SKILL.md
```

The `SKILL.md` file contains markdown-formatted instructions that the agent follows when the skill is active. This follows the [Agent Skills specification](https://agentskills.io/specification).

## Source Directories

Skills are installed from three sources, processed in priority order (highest to lowest):

| Priority | Source | Location | Install method |
|----------|--------|----------|----------------|
| 1 | Project skills | `project-skills/` at repo root | Symlink |
| 2 | Package skills | `package-skills/` at repo root | Symlink |
| 3 | External repos | Configured via `agent-skills.json` or `--repo` | Copy |

**Local skills are symlinked**, so changes to skill files are reflected immediately without re-running the command.

**External skills are copied** from a temporary clone that is deleted after the run.

If the same skill name appears in multiple sources, the higher-priority source wins and a conflict warning is printed. The lower-priority skill is skipped.

## Configuration: `agent-skills.json`

External git repositories to pull skills from are listed in `agent-skills.json` at the repo root:

```json
{
    "repos": [
        "git@github.com:org/shared-skills.git",
        "git@github.com:org/other-skills.git#main"
    ]
}
```

Each entry is an SSH git URL, optionally followed by `#ref` to specify a branch, tag, or commit hash. Repos are fetched in order; earlier entries take priority over later ones.

Only the `package-skills/` folder is fetched from each external repo (using git sparse checkout), so the rest of the repository is not downloaded.

## Running the Command

The `install-agent-skills` script in the root `package.json` runs the command with the project config:

```sh
pnpm run install-agent-skills
```

This is equivalent to:

```sh
pnpm exec comet install-agent-skills --config agent-skills.json
```

The command is also run automatically as part of `install.sh`.

### Options

| Option | Description |
|--------|-------------|
| `--config <path>` | Load external repos from a JSON config file |
| `--repo <url>` | Add an external repo (repeatable; combined with `--config` repos, processed after them) |
| `--dry-run` | Print what would be installed without making any changes |

### Examples

Preview what would be installed:

```sh
pnpm exec comet install-agent-skills --dry-run
```

Install with an additional ad-hoc external repo:

```sh
pnpm exec comet install-agent-skills --config agent-skills.json --repo git@github.com:org/extra-skills.git#main
```

## Adding Skills to a Project

### Project-specific skills

Place skill folders inside `project-skills/` at the repo root. These are highest priority and override any same-named skills from packages or external repos.

```
project-skills/
└── code-style/
    └── SKILL.md
```

### Package skills

If you maintain a package inside the Comet monorepo (or a downstream project), place skill folders inside `package-skills/` at the repo root. These override external repo skills but are overridden by project-specific skills.

```
package-skills/
└── api-conventions/
    └── SKILL.md
```

### External repo skills

Add the repo URL to `agent-skills.json`. The command will sparse-fetch the repo's `package-skills/` directory and copy those skill folders into the target directories.

## Target Directories

The command installs skills into two directories:

| Directory | Used by |
|-----------|---------|
| `.agents/skills/` | Cloud agents (e.g. GitHub Copilot Workspace) |
| `.claude/skills/` | Local IDE agents (e.g. Claude Code) |

Existing skills in these directories are overwritten when a skill with the same name is installed. Skills not managed by the command are left untouched.

## Conflict Resolution

When the same skill name exists in multiple sources:

1. The higher-priority source is installed.
2. A `CONFLICT` warning is printed for each skipped source.
3. No error is thrown — the command completes successfully.

Example output:

```
Installing 1 skill(s) from local project-skills/...
  Symlinked: code-style
Installing 2 skill(s) from external git@github.com:org/shared-skills.git (package-skills/)...
  CONFLICT: "code-style" from external git@github.com:org/shared-skills.git (package-skills/) skipped (already installed from a higher-priority source)
  Copied: api-conventions
```

## How External Repos Are Fetched

External repos are cloned into a temporary directory using git sparse checkout, fetching only the `package-skills/` folder:

1. `git init` + `git remote add origin`
2. `core.sparseCheckout = true` with `package-skills/` as the only path
3. `git fetch --depth 1 origin <ref>` (shallow fetch for branches/tags)
4. Falls back to a full fetch if shallow fetch fails (e.g. for commit hashes)
5. The temporary directory is deleted after installation

This keeps network usage minimal when external repos are large.
