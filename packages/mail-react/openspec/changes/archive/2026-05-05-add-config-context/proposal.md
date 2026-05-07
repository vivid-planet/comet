## Why

Some block components need runtime, environment-specific values that don't belong on the visual `Theme` (DAM `baseUrl`, the API's allowed image sizes, future per-project integration data). Threading these as props at every render site is repetitive and brittle. A separate `Config` context — sibling to `Theme` — gives downstream components a single, type-safe place to read this data, and gives consumers a single place to wire it.

## What Changes

- Add a new `Config` interface (initially empty, augmentable by both this package and consumers via TypeScript interface declaration merging)
- Add `ConfigProvider` for placing a `Config` value in the React tree
- Add `useConfig` hook that returns the current `Config`, defaulting to `{}` when no provider is mounted (no provider required for templates that don't need any config)
- Add optional `config` prop on `MjmlMailRoot` that mounts `ConfigProvider` internally, mirroring the existing `theme` prop pattern
- Export `Config`, `ConfigProvider`, `useConfig` from `src/index.ts`
- Add a changeset describing the new exports

## Capabilities

### New Capabilities
- `config-context`: Runtime configuration context for `@comet/mail-react`. Provides an augmentable `Config` type, a `ConfigProvider`, a `useConfig` hook, and a `config` prop on `MjmlMailRoot`. Empty by default; downstream blocks and consumers add keys through TypeScript interface declaration merging.

### Modified Capabilities
<!-- None. -->

## Impact

- New files under `packages/mail-react/src/config/`:
    - `ConfigProvider.tsx` (provider, hook, `Config` interface)
- Modified file: `src/components/mailRoot/MjmlMailRoot.tsx` adds an optional `config` prop and mounts `ConfigProvider` internally
- New exports in `src/index.ts`: `Config`, `ConfigProvider`, `useConfig`
- New changeset under `.changeset/` at the repo root
- **Unblocks** the `add-pixel-image-blocks` change, which augments `Config` with a `pixelImage` key and is its first consumer
