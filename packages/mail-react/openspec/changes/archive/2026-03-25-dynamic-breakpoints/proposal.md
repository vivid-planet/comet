## Why

`createTheme` hardcodes exactly two breakpoint keys (`default` and `mobile`). Any breakpoint key added via TypeScript module augmentation on `ThemeBreakpoints` is accepted by the type system but silently dropped at runtime. This makes breakpoint augmentation — which the spec explicitly supports — a silent data-loss bug. Additionally, `createBreakpoint` is needed by consumers who augment breakpoints, so it should be part of the public API.

## What Changes

- **BREAKING**: `createTheme` breakpoint overrides change from plain numbers to `ThemeBreakpoint` objects (created via `createBreakpoint`).
- Export `createBreakpoint` from the package's main entry point.
- `createTheme` resolves breakpoints dynamically by spreading `defaultTheme.breakpoints`, auto-deriving `default` from `sizes.bodyWidth`, then overlaying all override entries — instead of hardcoding two keys.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `theme-system`: Breakpoint overrides change from `number` to `ThemeBreakpoint` (via `createBreakpoint`). `createBreakpoint` becomes a public export. `createTheme` handles arbitrary breakpoint keys dynamically.

## Impact

- `src/theme/createTheme.ts` — override type and merge logic change
- `src/index.ts` — add `createBreakpoint` export
- `openspec/specs/theme-system/spec.md` — update requirements and scenarios for new override shape and `createBreakpoint` export
- Storybook stories that pass breakpoint overrides (if any) need updating
