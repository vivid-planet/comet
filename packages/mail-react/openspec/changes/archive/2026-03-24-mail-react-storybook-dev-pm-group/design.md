## Context

The monorepo root `dev-pm.config.ts` defines a `storybook-mail-react` script that runs `pnpm --filter @comet/mail-react run storybook`. It is currently tagged with `group: ["storybook"]`, so it starts whenever someone runs the `@storybook` group alongside `comet-storybook` and `@comet/admin` Storybook. A separate `mail-react` script (package dev) already uses `group: ["mail-react"]`.

## Goals / Non-Goals

**Goals:**

- Stop coupling mail-react Storybook startup to the global Storybook dev-pm group.
- Align dev-pm grouping with package ownership: mail tooling lives under the `mail-react` group.

**Non-Goals:**

- Changing Storybook port, scripts in `package.json`, or Storybook config under `.storybook/`.
- Adding new dev-pm scripts beyond retagging the existing `storybook-mail-react` entry.

## Decisions

1. **Reuse the existing `mail-react` dev-pm group** instead of inventing a second group name (`mail-storybook`, etc.). The package already has a `mail-react` entry; adding `storybook-mail-react` to `group: ["mail-react"]` keeps one obvious entry point for “work on @comet/mail-react” at the cost of starting two processes when the whole group is used.

2. **Remove `storybook` from the `storybook-mail-react` entry’s `group` array** so `@storybook` no longer launches mail-react Storybook. Alternatives considered: a dedicated `mail-react-storybook`-only group (extra mental overhead for a single script) or leaving the script in both groups (defeats isolation).

## Risks / Trade-offs

- **[Risk] Habit / docs assume `@storybook` starts everything** → **Mitigation:** Update the `storybook-setup` spec so the dev-pm integration requirement matches the `mail-react` group.
- **[Trade-off] `@mail-react` starts dev watch and Storybook together** → Acceptable for now; developers can still run `pnpm --filter @comet/mail-react run storybook` alone or use dev-pm by script name if they need only one process.

## Migration Plan

1. Edit monorepo root `dev-pm.config.ts`: set `storybook-mail-react` to `group: ["mail-react"]` only.
2. Archive or apply this change so `openspec/specs/storybook-setup/spec.md` matches.

## Open Questions

- None for this scope; if `@mail-react` becomes too heavy later, a split into a Storybook-only subgroup can be a follow-up change.
