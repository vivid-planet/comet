---
"@comet/cli": minor
---

Add `install-agent-skills` command

Installs agent skill files from local `project-skills/` and `package-skills/` directories into `.agents/skills/` and `.claude/skills/`. Accepts optional external SSH git repo URLs to install skills from those repos' `package-skills/` folders. Local skills always take priority; conflicts are reported.
