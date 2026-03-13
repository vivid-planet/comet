---
"@comet/cli": minor
---

`install-agent-skills`: add support for a `skills/` directory as the primary source for agent skills

Skills in a `skills/` directory with `metadata.internal: true` in their `SKILL.md` are excluded from installation.
This replaces the previous `project-skills/` / `package-skills/` convention:

- Skills previously in `package-skills/`: move to `skills/` and add `metadata.internal: true` to their `SKILL.md`
- Skills previously in `project-skills/`: move to `skills/` without the `internal` flag

The old `project-skills/` and `package-skills/` directories continue to work for backward compatibility but are deprecated.
