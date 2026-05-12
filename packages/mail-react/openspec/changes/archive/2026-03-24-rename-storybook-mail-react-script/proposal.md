## Why

The current dev-pm script name `storybook-mail-react` is inconsistent with the package-first naming style already used elsewhere in the repository (`mail-react`). A clearer name improves discoverability and reduces confusion when selecting scripts by name.

## What Changes

- Rename the dev-pm script key in monorepo root `dev-pm.config.ts` from `storybook-mail-react` to `mail-react-storybook`.
- Keep the command and group behavior unchanged so the rename is non-functional (identifier-only).
- Update OpenSpec documentation references to use the new script name.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `storybook-setup`: dev-pm integration wording now references `mail-react-storybook` as the script identifier.

## Impact

- Monorepo root `dev-pm.config.ts` script entry key.
- Any scripts, docs, or specs referring to `storybook-mail-react`.
- Developer workflow that starts a dev-pm script by explicit script name.
