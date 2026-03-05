---
"@comet/cli": minor
---

Add `install-agent-skills` command

Use `npx @comet/cli install-agent-skills` to install [agent skills](https://agentskills.io/) into your project. Skills are placed into `.agents/skills/` and `.claude/skills/`, where AI coding agents (such as Claude Code or GitHub Copilot) pick them up automatically.

Supports fetching skills from external SSH git repos (only their `package-skills/` folder, via sparse checkout), project-specific skills from `project-skills/`, and package skills from `package-skills/`. Local skills take priority over external ones; conflicts are reported. Supports `--config <path>` for a JSON config file listing repos, `--repo <url>` for ad-hoc repos, and `--dry-run` to preview changes.
