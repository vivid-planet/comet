## 1. Theme Types and Defaults

- [x] 1.1 Create `src/theme/themeTypes.ts` with `Theme`, `ThemeSizes`, `ThemeBreakpoints`, and `ThemeBreakpoint` interfaces (all with TSDoc comments)
- [x] 1.2 Create `src/theme/createBreakpoint.ts` with internal `createBreakpoint` helper (shared by `createTheme` and `defaultTheme`)
- [x] 1.3 Create `src/theme/defaultTheme.ts` with default theme values using `createBreakpoint` (`sizes.bodyWidth: 600`, `breakpoints.default: 600`, `breakpoints.mobile: 420`)

## 2. createTheme

- [x] 2.1 Create `src/theme/createTheme.ts` with `createTheme` function and internal deep merge utility. Imports `createBreakpoint` from its own file. Accepts partial overrides (breakpoints as numbers), deep-merges with defaults, and auto-derives `breakpoints.default` from `sizes.bodyWidth`

## 3. ThemeProvider and useTheme

- [x] 3.1 Create `src/theme/ThemeProvider.tsx` with `ThemeProvider` component and `useTheme` hook (throws outside provider)

## 4. MjmlMailRoot Integration

- [x] 4.1 Update `MjmlMailRoot` to accept optional `theme` prop, wrap children in `ThemeProvider`, set `MjmlBody width` from `theme.sizes.bodyWidth`, and render `MjmlBreakpoint` from `theme.breakpoints.mobile.value`
- [x] 4.2 Update TSDoc on `MjmlMailRoot` to document the `theme` prop

## 5. Package Exports

- [x] 5.1 Update `src/index.ts` to export `createTheme`, `ThemeProvider`, `useTheme`, and all theme interfaces (`Theme`, `ThemeSizes`, `ThemeBreakpoints`, `ThemeBreakpoint`)

## 6. Storybook

- [x] 6.1 Create `ThemeProvider` component story at `src/theme/__stories__/ThemeProvider.stories.tsx` with autodocs and a custom theme demo
- [x] 6.2 Update storybook decorator to pass `context.parameters.theme` to `MjmlMailRoot`

## 7. Changeset

- [x] 7.1 Create a changeset file in `.changeset/` (at the git root) describing the new theme system exports and the `theme` prop on `MjmlMailRoot`
