---
"@comet/cli": minor
---

`install-agent-skills`: add support for a `skills/` directory as the primary source for agent skills

The `project-skills/` and `package-skills/` directories are no longer supported. Move all skills into a single `skills/` directory at the repo root:

- Skills previously in `project-skills/`: move to `skills/` and add `metadata.internal: true` to their `SKILL.md`
- Skills previously in `package-skills/`: move to `skills/` (without the `internal` flag)
