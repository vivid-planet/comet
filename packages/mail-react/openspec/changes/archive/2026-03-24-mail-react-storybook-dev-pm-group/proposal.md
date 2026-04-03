## Why

The mail-react Storybook is a separate concern from the main Comet Storybook stack. Starting the monorepo `@storybook` dev-pm group currently launches mail-react Storybook together with `comet-storybook` and admin package Storybook, which is unnecessary for mail-only work and blurs ownership while the package stays relatively independent.

## What Changes

- Remove the `storybook-mail-react` script from the `storybook` dev-pm group so `@storybook` no longer starts mail-react Storybook.
- Register `storybook-mail-react` under the existing `mail-react` dev-pm group so `pnpm exec dev-pm start @mail-react` starts both the package dev watcher and mail-react Storybook (same group as the existing `mail-react` script).

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `storybook-setup`: Update the dev-pm integration requirement so the expected group and developer workflow match the mail-react–scoped group instead of the global `@storybook` group.

## Impact

- Monorepo root `dev-pm.config.ts` (`storybook-mail-react` entry `group` array).
- Developers who relied on `@storybook` to start mail-react Storybook must use `@mail-react` (or start the script by name) instead.
- OpenSpec `storybook-setup` spec (dev-pm integration requirement) after archive.
