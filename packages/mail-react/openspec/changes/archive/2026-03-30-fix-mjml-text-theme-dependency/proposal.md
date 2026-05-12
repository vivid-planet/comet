## Why

`MjmlText` calls `useTheme()` unconditionally, which throws when no `ThemeProvider` is present. This breaks the "additive only" principle: consumers cannot use `MjmlText` as a drop-in replacement for the base `@faire/mjml-react` text component without setting up a theme. The same issue was already fixed in `MjmlSection` (PR #5387) using `useOptionalTheme`, but `MjmlText` was not addressed.

## What Changes

- Switch `MjmlText` from `useTheme()` to `useOptionalTheme()` so it works without a `ThemeProvider`
- When no theme is present and no theme-dependent props are used, `MjmlText` renders as a transparent pass-through to the base component
- When `variant` or `bottomSpacing` is used without a theme, throw a targeted error message
- Update existing spec to reflect optional theme behavior

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `mjml-text`: Add requirement that `MjmlText` works without a `ThemeProvider` when theme-dependent features (`variant`, `bottomSpacing`, `defaultVariant`) are not used, matching the pattern established by `MjmlSection`

## Impact

- `src/components/text/MjmlText.tsx` — component logic changes
- Existing consumers using `MjmlText` inside a `ThemeProvider` are unaffected
- Consumers without a `ThemeProvider` will now get a working component (no base styles applied) instead of a runtime error
