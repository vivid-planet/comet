## 1. Export createBreakpoint

- [ ] 1.1 Add TSDoc comment to `createBreakpoint` in `src/theme/createBreakpoint.ts` describing it as a public API for constructing `ThemeBreakpoint` values
- [ ] 1.2 Add `createBreakpoint` export to `src/index.ts`

## 2. Update createTheme

- [ ] 2.1 Change `CreateThemeOverrides` breakpoints type from `Partial<Record<keyof ThemeBreakpoints, number>>` to `Partial<ThemeBreakpoints>`
- [ ] 2.2 Replace hardcoded breakpoint resolution with dynamic spread: spread `defaultTheme.breakpoints`, then auto-derived `default` from `resolvedSizes.bodyWidth`, then `overrides?.breakpoints`
- [ ] 2.3 Update TSDoc on `createTheme` to reflect that breakpoint overrides use `createBreakpoint` instead of plain numbers

## 3. Changeset

- [ ] 3.1 Update the existing changeset at `.changeset/add-theme-system.md` to also mention that `createBreakpoint` is now exported and `createTheme` breakpoint overrides accept `ThemeBreakpoint` objects via `createBreakpoint` instead of plain numbers
