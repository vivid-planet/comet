# Agent Instructions — @comet/mail-react

## OpenSpec CLI

Run all OpenSpec commands via `pnpm exec openspec`, not directly:

- `pnpm exec openspec new change "<name>"`
- `pnpm exec openspec status --change "<name>" --json`
- `pnpm exec openspec instructions <artifact> --change "<name>" --json`

## Running processes (dev-pm)

Two dev-pm scripts are relevant to this package:

| Name                   | What it does                              |
| ---------------------- | ----------------------------------------- |
| `mail-react`           | `tsc --watch` — rebuilds `lib/` on change |
| `mail-react-storybook` | `storybook dev -p 6066 --no-open`         |

Check whether they are currently running:

```bash
pnpm exec -- dev-pm status mail-react
pnpm exec -- dev-pm status mail-react-storybook
```

Other useful commands:

```bash
pnpm exec -- dev-pm start mail-react-storybook
pnpm exec -- dev-pm restart mail-react-storybook
pnpm exec -- dev-pm logs --lines 100 mail-react-storybook
pnpm exec -- dev-pm start @mail-react     # starts both scripts (group)
```

## Storybook

Storybook runs on a fixed port: `http://localhost:6066`.

### Story index API

Storybook exposes a machine-readable index of all stories at `GET /index.json`. Use this to discover stories without globbing the filesystem:

```bash
# List every story as "id — title — name"
curl -s http://localhost:6066/index.json \
  | jq -r '.entries | to_entries[] | "\(.key) — \(.value.title) — \(.value.name)"'

# Find a specific story id by title
curl -s http://localhost:6066/index.json \
  | jq -r '.entries[] | select(.title == "Layout Patterns/Symmetric Two-Column Layout") | .id'
```

### Viewing a story

To visually verify a change, open the isolated story iframe in a browser using the story's `id` from `index.json`:

```
http://localhost:6066/iframe.html?id=<id>&viewMode=story
```

## Scripts

Run these from `packages/mail-react/` (run `nvm use` first).

| Script     | Result                                                                                |
| ---------- | ------------------------------------------------------------------------------------- |
| `lint:fix` | Auto-fixes ESLint and Prettier issues in the source                                   |
| `lint`     | Reports all remaining lint, formatting, and TypeScript errors (does not fix anything) |
| `test`     | Runs the Vitest suite once and exits                                                  |

After making changes, run `pnpm run lint:fix` and then `pnpm run lint` to verify. TypeScript errors reported by `lint` must be fixed manually — `lint:fix` does not cover them.

## See also

- Skill: `skills/comet-mail-react/SKILL.md` — patterns and conventions for building emails with this package
- Docs: `docs/docs/3-features-modules/13-building-html-emails/` — end-user documentation for `@comet/mail-react`
