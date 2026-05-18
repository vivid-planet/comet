## 1. Core implementation

- [x] 1.1 Create `src/config/ConfigProvider.tsx` containing: the `Config` interface (empty, with TSDoc explaining the augmentation pattern via `declare module "@comet/mail-react"`), an internal React context, the `ConfigProvider` component (accepts `config: Config` + `children`), and the `useConfig` hook (returns the nearest context value, falling back to `{}` when no provider is mounted).
- [x] 1.2 Add TSDoc on each exported symbol: `Config` (purpose + augmentation example), `ConfigProvider` (purpose + relationship to `MjmlMailRoot.config`), `useConfig` (return value, no-provider fallback).

## 2. `MjmlMailRoot` integration

- [x] 2.1 Add an optional `config?: Config` prop to `MjmlMailRoot`. Always wrap children in `ConfigProvider`, falling back to `{}` when `config` is omitted. Update the component's TSDoc to mention the new prop.

## 3. Public exports

- [x] 3.1 Export `Config`, `ConfigProvider`, and `useConfig` from `src/index.ts`.

## 4. Tests

- [x] 4.1 Add `src/config/ConfigProvider.test.tsx` covering the two non-trivial behaviors: `useConfig` returns `{}` when no `ConfigProvider` is mounted (pins the no-throw fallback), and `MjmlMailRoot.config` flows the value to descendants (pins the integration contract). Plain provider→hook reads and nested-provider semantics are React `useContext` itself and are not retested here.

## 5. Lint, build, verification

- [x] 5.1 Run `pnpm run lint:fix` then `pnpm run lint` from `packages/mail-react/`; fix any remaining ESLint or TypeScript errors manually.
- [x] 5.2 Run `pnpm run test` and confirm all tests pass.

## 6. Changeset

- [x] 6.1 Check `.changeset/` at the repo root for an existing unmerged changeset that already covers the runtime config context; update it if found, otherwise create a new minor changeset for `@comet/mail-react`. Describe the change from the consumer's perspective: a new `Config` context, an augmentable `Config` interface (with a short example), `ConfigProvider`, `useConfig`, and the optional `config` prop on `MjmlMailRoot`. Follow the formatting rules in `CONTRIBUTING.md`.

## 7. Validate

- [x] 7.1 Run `pnpm --filter @comet/mail-react exec openspec validate add-config-context --strict` and resolve any reported issues.
