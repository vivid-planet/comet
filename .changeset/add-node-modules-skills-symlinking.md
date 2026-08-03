---
"@comet/cli": minor
---

Add node_modules skills discovery to `install-agent-skills` command

The command now scans direct dependencies in `node_modules` (including `@scoped` packages) for `skills/` directories and creates symlinks to agent-specific directories. This is compatible with the [npm-based Agent Skills convention](https://github.com/antfu/skills-npm/blob/HEAD/PROPOSAL.md).
