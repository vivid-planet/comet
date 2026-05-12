## Context

`@comet/mail-react` currently has no shared design tokens. Values like the email body width are either absent or hardcoded per-component. Components that need consistent sizing or responsive breakpoints have no mechanism to share or customize these values. The library needs a theme system that is minimal today but extensible for future tokens (colors, typography, spacing, etc.) via TypeScript module augmentation.

## Goals / Non-Goals

**Goals:**

- Provide a typed theme with default values for `sizes` and `breakpoints`.
- Allow consumers to customize theme values via `createTheme(overrides)`.
- Make the theme available to any component via React context (`ThemeProvider` / `useTheme`).
- Support extending the theme type at any level via module augmentation.
- Integrate the theme into `MjmlMailRoot` so it's available automatically.
- Keep it minimal — only `sizes.bodyWidth` and two breakpoints for now.

**Non-Goals:**

- Colors, typography, spacing, or other token categories (future work).
- Runtime theme switching (e.g. toggling between themes without re-rendering the tree). Nesting `ThemeProvider` is supported, but dynamic switching is not a goal.
- Providing a CSS-in-JS or styling solution — the theme is a data object, not a styling engine.
- Theme validation at runtime beyond TypeScript's compile-time checks.

## Decisions

### 1. All theme type segments are interfaces (not type aliases)

TypeScript `interface` declarations support declaration merging, which is the foundation for module augmentation. Every segment of the theme type (`Theme`, `ThemeSizes`, `ThemeBreakpoints`) is defined as an `interface` so consumers can extend any level.

**Alternative considered:** Type aliases with intersection (`&`). Rejected because type aliases cannot be augmented via `declare module`.

### 2. `createTheme` input uses plain numbers for breakpoints

Consumers pass `{ breakpoints: { mobile: 420 } }` — plain numbers. Internally, `createBreakpoint(value)` transforms each number into the richer `ThemeBreakpoint` shape (`{ value, belowMediaQuery }`). This keeps the input ergonomic while the output is fully resolved.

The `createBreakpoint` function is internal and not exported from the package.

### 3. `breakpoints.default` auto-derives from `sizes.bodyWidth`

`createTheme` resolves values in two passes:
1. Resolve `sizes` by merging user overrides onto defaults.
2. Resolve `breakpoints`, using `resolvedSizes.bodyWidth` as the default value for `breakpoints.default` (unless explicitly overridden).

This means `createTheme({ sizes: { bodyWidth: 700 } })` produces `breakpoints.default.value === 700` automatically.

**Alternative considered:** Static default (always 600). Rejected because `breakpoints.default` semantically represents the body width boundary, so they should stay in sync unless the consumer explicitly decouples them.

### 4. Hand-rolled deep merge (no new dependency)

A simple recursive merge utility handles the theme's shallow structure (2-3 levels deep). This avoids adding a runtime dependency for a straightforward operation. The merge handles plain objects only — no special array, Date, or class instance handling needed.

The utility lives in `src/theme/createTheme.ts` alongside the `createTheme` function, as it is only used there.

**Alternative considered:** `ts-deepmerge` package. Rejected to keep the dependency footprint minimal, since the theme structure is shallow enough.

### 5. `useTheme()` throws outside a provider

Calling `useTheme()` without a wrapping `ThemeProvider` (or `MjmlMailRoot`) throws an error. This catches misuse early rather than silently returning undefined or a partial object.

**Alternative considered:** Return a default theme when no provider is found. Rejected because it masks mistakes — if `useTheme` silently works outside a provider, a component could accidentally render without the consumer's configured theme.

### 6. File organization under `src/theme/`

```
src/theme/
  createBreakpoint.ts    — createBreakpoint helper (internal, not exported from package)
  createTheme.ts         — createTheme function, deep merge utility
  defaultTheme.ts        — default theme values (uses createBreakpoint)
  ThemeProvider.tsx       — ThemeProvider component, useTheme hook, context
  themeTypes.ts          — Theme, ThemeSizes, ThemeBreakpoints, ThemeBreakpoint interfaces
```

`createBreakpoint` has its own file so it can be shared by both `createTheme` and `defaultTheme` without either depending on the other. Theme types are in a separate file from the provider to allow importing types without pulling in React.

### 7. `MjmlMailRoot` renders `<MjmlBreakpoint>` from the theme's mobile breakpoint

MJML's `<mj-breakpoint>` controls the viewport width at which columns stack vertically (desktop → mobile layout switch). This is semantically the same as the theme's `breakpoints.mobile` value. `MjmlMailRoot` renders `<MjmlBreakpoint width={theme.breakpoints.mobile.value + "px"} />` inside `<MjmlHead>` to keep them in sync.

Note: MJML's built-in default breakpoint is 480px, while our theme's default `breakpoints.mobile` is 420px. By explicitly setting `<MjmlBreakpoint>`, `MjmlMailRoot` uses the theme's value rather than MJML's default.

### 8. Storybook decorator passes theme from story parameters

The storybook `MailRendererDecorator` wraps stories in `MjmlMailRoot`. It reads `context.parameters.theme` and passes it to `MjmlMailRoot`, allowing individual stories to use a custom theme. When no `theme` parameter is set, `MjmlMailRoot` uses the default theme automatically.

## Risks / Trade-offs

- **Module augmentation is opt-in but unchecked at creation time** — If a consumer augments `Theme` with new required keys, `createTheme({})` will claim to return a complete `Theme` at compile time but will be missing augmented values at runtime. This is the standard trade-off with MUI-style augmentation. Consumers are responsible for providing their augmented values.

- **Hand-rolled deep merge is limited** — The merge utility only handles plain objects. If the theme later includes arrays, Maps, or class instances, the merge will need updating. Mitigated by the theme's intentionally simple structure.

- **Body width default change** — `MjmlBody` currently has no explicit `width`. Adding `width={theme.sizes.bodyWidth}` changes the rendered output (MJML's default body width is 600px, which matches our default, so in practice the output is identical). If MJML's default ever diverges, our explicit value keeps behavior consistent.
