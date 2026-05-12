## Why

Components in `@comet/mail-react` need access to shared design tokens (body width, breakpoints) to produce consistent output. Currently, values like the email body width are hardcoded per-component with no way for consumers to customize them. A theme system provides a single source of truth for these tokens and makes the library extensible for project-specific values via TypeScript module augmentation.

## What Changes

- Add a `Theme` type system with `sizes` (body width) and `breakpoints` (default, mobile), all defined as interfaces to support module augmentation at every level.
- Add `createTheme(overrides?)` that deep-merges partial overrides onto sensible defaults, with `breakpoints.default` auto-deriving from `sizes.bodyWidth` when not explicitly set.
- Add a React context-based `ThemeProvider` and `useTheme()` hook. `useTheme()` throws when used outside a provider.
- `MjmlMailRoot` gains an optional `theme` prop (defaults to `createTheme()`), wraps children in `ThemeProvider`, and sets `<MjmlBody width={theme.sizes.bodyWidth}>`.

## Capabilities

### New Capabilities

- `theme-system`: Core theme types, `createTheme`, `ThemeProvider`, `useTheme`, and module augmentation support.

### Modified Capabilities

- `mjml-mail-root`: `MjmlMailRoot` integrates the theme by accepting an optional `theme` prop, providing it via `ThemeProvider`, and using `sizes.bodyWidth` as the `<MjmlBody>` width.

## Impact

- **New files**: Theme types, default values, `createTheme`, `ThemeProvider`/`useTheme`.
- **Modified files**: `MjmlMailRoot.tsx` (theme prop + provider wrapping + body width), `index.ts` (new exports), storybook decorator (passes theme through to `MjmlMailRoot`).
- **Exports added**: `ThemeProvider`, `useTheme`, `createTheme`, all theme interfaces (`Theme`, `ThemeSizes`, `ThemeBreakpoints`, `ThemeBreakpoint`).
- **No new runtime dependencies** — deep merge is hand-rolled.
- **Backwards compatible** — the `theme` prop on `MjmlMailRoot` is optional; existing usage without a theme continues to work with defaults.
