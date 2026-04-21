# Coding Rules for Agents

Concise, actionable rules for coding agents. When the user's task touches any of these areas, follow the corresponding rule file.

| Area                              | File                                                     |
| --------------------------------- | -------------------------------------------------------- |
| Git, commits, PRs                 | [git.instructions.md](git.instructions.md)               |
| General (all languages)           | [general.instructions.md](general.instructions.md)       |
| Secure software development       | [security.instructions.md](security.instructions.md)     |
| Libraries & NPM packages          | [libraries.instructions.md](libraries.instructions.md)   |
| Naming conventions                | [naming.instructions.md](naming.instructions.md)         |
| TypeScript                        | [typescript.instructions.md](typescript.instructions.md) |
| Styling / CSS                     | [styling.instructions.md](styling.instructions.md)       |
| API (NestJS / MikroORM / GraphQL) | [api-nestjs.instructions.md](api-nestjs.instructions.md) |
| React                             | [react.instructions.md](react.instructions.md)           |
| Kubernetes                        | [kubernetes.instructions.md](kubernetes.instructions.md) |
| CDN / caching                     | [cdn.instructions.md](cdn.instructions.md)               |
| PostgreSQL                        | [postgresql.instructions.md](postgresql.instructions.md) |

## How to apply

- Rules are imperative ("do X", "never Y"). When in doubt, the referenced guideline doc wins.
- Exceptions are acceptable when well-justified — flag the deviation in the PR description, not silently.
- These rules cover _what_ to do, not _how_ to set up the repo — see [AGENTS.md](../../AGENTS.md) for build/lint/dev workflow.

## Scoping via frontmatter

Each rule file carries frontmatter understood by multiple agent tools, so the same file auto-attaches under Claude Code, GitHub Copilot, and Cursor-style loaders without duplication:

| Field         | Consumed by                  | Notes                                                      |
| ------------- | ---------------------------- | ---------------------------------------------------------- |
| `description` | Claude Code, Copilot, Cursor | One-line summary shown to the agent.                       |
| `applyTo`     | GitHub Copilot               | **Comma-separated** glob string (Copilot's native format). |
| `paths`       | Claude Code                  | YAML list of globs.                                        |
| `globs`       | Cursor / generic loaders     | YAML list of globs. Mirrors `paths`.                       |
| `alwaysApply` | Cursor                       | `false` = opt-in based on globs.                           |

When adding a new rule file, include all five fields so any tool can pick it up:

```yaml
---
description: One-line summary of what this rule covers
applyTo: "path/**/*.ext,other/**/*.ext"
paths:
    - "path/**/*.ext"
    - "other/**/*.ext"
globs:
    - "path/**/*.ext"
    - "other/**/*.ext"
alwaysApply: false
---
```
