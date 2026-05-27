---
"@comet/cli": minor
---

Add node_modules skills and rules discovery to `install-agent-features` command

The command now scans direct dependencies in `node_modules` (including `@scoped` packages) for `skills/` and `rules/` directories and creates symlinks to agent-specific directories. This is compatible with the [npm-based Agent Skills convention](https://github.com/antfu/skills-npm/blob/HEAD/PROPOSAL.md) and extends it to also support rules.
