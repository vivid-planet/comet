---
"@comet/cli": major
---

Replace `install-agent-skills` with `install-agent-features` — a combined installer for agent skills and agent rules

`install-agent-features` installs skills from `skills/<name>/SKILL.md` and `agentic-plugin/skills/<name>/SKILL.md` (folders) and rules from `rules/<name>.md` (single markdown files) — both from the local repo and from external git repos listed in `agent-features.json`. Skills install into `.agents/skills/` and `.claude/skills/`; rules install into `.agents/rules/`, `.claude/rules/`, `.cursor/rules/`, and `.github/instructions/` so they are picked up by Claude Code, Cursor, GitHub Copilot, and other cloud agents. Rules support the same optional `metadata.internal: true` frontmatter as skills, and may be organized into subdirectories (the layout is preserved in each target).

Example `agent-features.json`:

```json
{
    "repos": ["https://github.com/vivid-planet/comet.git"]
}
```

Run:

```sh
npx @comet/cli install-agent-features
```

**Breaking change:** the `install-agent-skills` command and its `agent-skills.json` config are removed. Migrate by renaming `agent-skills.json` to `agent-features.json` (the schema is identical) and replacing the `install-agent-skills` invocation in `package.json` and `install.sh` with `install-agent-features`.
