## Context

`MjmlSection` wraps `@faire/mjml-react`'s `MjmlSection` and adds theme-dependent features (`indent`). It currently calls `useTheme()` unconditionally, which throws outside a `ThemeProvider`. This makes it impossible to use as a drop-in replacement for the base component — breaking the "additive only" rule.

The theme is only needed when `indent` is `true`. All other custom features (`disableResponsiveBehavior`, `slotProps`, `className` merging) work without a theme.

## Goals / Non-Goals

**Goals:**

- `MjmlSection` works without `ThemeProvider` when `indent` is not used
- Clear, targeted error when `indent` is used without a theme
- No public API changes

**Non-Goals:**

- Making `useTheme` itself optional (it correctly throws for consumers)
- Exporting the new internal hook

## Decisions

### Internal `useOptionalTheme` hook

Add a `useOptionalTheme()` function in `ThemeProvider.tsx` that returns `Theme | null`. It reads the same `ThemeContext` but returns `null` instead of throwing when the context is absent.

**Why not modify `useTheme`?** The public `useTheme` hook has a clear contract: it throws outside a provider. Consumers rely on this to catch misconfiguration. Changing it would weaken the API for everyone. A separate internal hook keeps both contracts clean.

**Why not a parameter like `useTheme({ optional: true })`?** Overloaded return types (`Theme` vs `Theme | null`) based on a runtime flag require type assertions or complex generics. Two distinct functions with distinct return types are simpler and type-safe.

### Targeted error for `indent` without theme

When `indent` is `true` and `useOptionalTheme()` returns `null`, throw an error with a message like: "The `indent` prop requires a ThemeProvider or MjmlMailRoot." This is more actionable than the generic `useTheme` error.

## Risks / Trade-offs

- [Minimal risk] Future custom components that need optional theme access will need to import `useOptionalTheme` from ThemeProvider — but since it's internal, this is just an implementation detail.
- [Trade-off] Two hooks for theme access adds a small amount of internal surface. Justified by keeping the public API strict while allowing internal flexibility.
