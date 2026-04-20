---
"@comet/cli": minor
---

Add `install-agent-features` command — combined installer for agent skills and agent rules

`install-agent-features` is the new recommended way to pull agent-facing content into a project. It installs skills from `skills/<name>/SKILL.md` (folders) and rules from `rules/<name>.md` (single markdown files) — both from the local repo and from external git repos listed in `agent-features.json`. Skills install into `.agents/skills/` and `.claude/skills/`; rules install into `.agents/rules/`, `.claude/rules/`, `.cursor/rules/`, and `.github/instructions/` so they are picked up by Claude Code, Cursor, GitHub Copilot, and other cloud agents. Rules support the same optional `metadata.internal: true` frontmatter as skills.

Example `agent-features.json`:

```json
{
    "repos": ["git@github.com:vivid-planet/comet.git"]
}
```

Run:

```sh
npx @comet/cli install-agent-features
```

**Deprecated:** `install-agent-skills` still works (reading `agent-skills.json`, installing skills only) but prints a deprecation warning. Migrate by renaming `agent-skills.json` to `agent-features.json` and swapping the script.
