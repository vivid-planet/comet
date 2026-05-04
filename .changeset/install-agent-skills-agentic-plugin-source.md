---
"@comet/cli": minor
---

`install-agent-skills`: also install skills from `agentic-plugin/skills/`

In addition to the existing `skills/` directory, the command now installs skills from `agentic-plugin/skills/`. This allows shipping agent skills as part of a Claude Code plugin (with a `.claude-plugin/plugin.json` manifest) without losing the ability to install them via `install-agent-skills`.

Both directories are also fetched (via git sparse checkout) when consuming external repos listed in `agent-skills.json`. `skills/` keeps priority over `agentic-plugin/skills/`.
