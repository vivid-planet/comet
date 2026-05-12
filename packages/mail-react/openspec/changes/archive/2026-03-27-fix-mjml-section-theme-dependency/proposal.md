## Why

`MjmlSection` calls `useTheme()` unconditionally, which throws when there is no `ThemeProvider` ancestor. This means the component cannot be used as a drop-in replacement for `@faire/mjml-react`'s `MjmlSection` — violating the project rule that custom components are additive only, with no breaking changes to the base API.

## What Changes

- Add an internal (not exported) `useOptionalTheme` hook that returns `Theme | null` instead of throwing
- Update `MjmlSection` to use `useOptionalTheme` so it works without a `ThemeProvider`
- When `indent` is `true` but no theme is available, throw a targeted error explaining that `indent` requires a `ThemeProvider` or `MjmlMailRoot`

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `mjml-section`: The component must work without a `ThemeProvider` when theme-dependent features (`indent`) are not used. When `indent` is used without a theme, throw a specific error.
- `theme-system`: Add an internal-only `useOptionalTheme` hook (not exported, no public API change).

## Impact

- `src/theme/ThemeProvider.tsx` — new private `useOptionalTheme` function
- `src/components/section/MjmlSection.tsx` — switch from `useTheme` to `useOptionalTheme`, add guard for `indent` without theme
- No public API changes, no new exports
