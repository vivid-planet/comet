---
title: Install Agent Skills
---

The `install-skills` command in `@comet/cli` manages [Claude Code](https://claude.ai/code) skills for a project.
Skills are reusable instruction sets that Claude Code loads when working in your repository — for example, a skill for creating changesets, running the right build commands, or following project-specific conventions.

Skills come from two sources:

- **Local skills** — committed in `project-skills/` and always re-linked on every run.
- **Remote skills** — fetched from external git repositories and stored in `.agents/skills/`.

Both types are symlinked into `.claude/skills/`, which is where Claude Code discovers them.

## Directory structure

```
<repo-root>/
  project-skills/          ← committed; local skills live here
    my-skill/
      SKILL.md
      ...
  .agents/
    skills/                ← gitignored; remote skills are copied here
      remote-skill/
        SKILL.md
        ...
    skills.json            ← gitignored; tracks installed remote sources
  .claude/
    skills/                ← gitignored; all symlinks go here
      my-skill    -> ../../project-skills/my-skill
      remote-skill -> ../../.agents/skills/remote-skill
```

Add the following entries to your `.gitignore`:

```
.agents/
.claude/skills/
```

## Usage

```bash
# Re-link local project-skills/ only
comet install-skills

# Install remote skills and re-link local skills
comet install-skills https://github.com/org/repo

# Pin to a specific branch, tag, or commit
comet install-skills https://github.com/org/repo#v1.0.0

# Install from multiple repositories at once
comet install-skills https://github.com/org/repo1 https://github.com/org/repo2#main
```

The command **always** re-links every skill found in `project-skills/`, even when no remote repo arguments are passed.

### Skill groups

Skills can be tagged with a `skillGroup` in their `SKILL.md` frontmatter.
Skills without a `skillGroup` belong to the implicit **default group** and are always installed.
Skills in a named group are optional — the command will prompt you to choose which groups to install:

```
Available skill groups (default group is always installed):
  1. analytics
  2. testing

Select groups to install (comma-separated numbers, or 'all'):
```

Use CLI flags to skip the prompt:

```bash
# Install only default group skills (no prompt)
comet install-skills --default https://github.com/org/repo

# Install specific group(s) (no prompt)
comet install-skills --group analytics https://github.com/org/repo
comet install-skills --group analytics --group testing https://github.com/org/repo
```

### Remote repo argument format

Each argument is a git URL with an optional `#<ref>` suffix:

| Argument | Behavior |
|---|---|
| `https://github.com/org/repo` | Clones the default branch |
| `https://github.com/org/repo#main` | Clones and checks out `main` |
| `https://github.com/org/repo#v2.0.0` | Clones and checks out the `v2.0.0` tag |
| `https://github.com/org/repo#<sha>` | Checks out a specific commit (requires `uploadpack.allowReachableSHA1InWant` on the server) |

The command performs a shallow sparse clone (`--depth 1 --sparse`) and only fetches the `package-skills/` folder from the remote repository, so it is fast even for large repositories.

## How skills are detected

A subfolder inside a `package-skills/` directory is treated as a skill if and only if it contains a `SKILL.md` file at its root.
Any subdirectory without `SKILL.md` is ignored.

## Defining a local skill

Create a folder inside `project-skills/` and add a `SKILL.md` file:

```
project-skills/
  create-changeset/
    SKILL.md
```

```markdown title="project-skills/create-changeset/SKILL.md"
# Create Changeset

Use this skill when the user asks to create a changeset.

1. Determine the affected package(s) and the bump type (patch / minor / major).
2. Create a file in `.changeset/` following the naming convention `<kebab-case-description>.md`.
3. Add the YAML frontmatter and a short description of the change.
```

To make a skill optional (only installed when its group is selected), add a `skillGroup` field to the frontmatter:

```markdown title="project-skills/analytics-dashboard/SKILL.md"
---
skillGroup: analytics
---

# Analytics Dashboard

Use this skill when working on the analytics dashboard.
```

After running `comet install-skills`, Claude Code will find the skill at `.claude/skills/create-changeset`.

## Defining a remote skill

Structure the repository so that skills live under a top-level `package-skills/` directory, each with its own `SKILL.md`:

```
package-skills/
  my-remote-skill/
    SKILL.md
    helper-prompt.md   ← optional supporting files
  analytics-skill/
    SKILL.md           ← may contain skillGroup frontmatter
```

Remote skills support the same `skillGroup` frontmatter as local skills.

When `comet install-skills https://github.com/org/skills-repo` is run, the command:

1. Sparse-clones only the `package-skills/` folder from the repository.
2. Copies each discovered skill into `.agents/skills/<name>/`.
3. Creates a symlink `.claude/skills/<name>` → `../../.agents/skills/<name>`.
4. Records the source in `.agents/skills.json`.

## Tracking installed remote sources

`.agents/skills.json` records which remote repositories have been installed:

```json
{
  "installedSkills": [
    {
      "url": "https://github.com/org/skills-repo",
      "ref": "main",
      "skills": ["my-remote-skill"]
    }
  ]
}
```

This file is regenerated on every run and should be gitignored.

## Automating setup with `install.sh`

Call `comet install-skills` from your project's `install.sh` so skills are always set up after a fresh clone or dependency install:

```bash
# Install local project-skills/ and fetch remote skills
node_modules/.bin/comet install-skills https://github.com/org/skills-repo
```

If your project only has local skills and no remote dependencies, omit the URL:

```bash
node_modules/.bin/comet install-skills
```
