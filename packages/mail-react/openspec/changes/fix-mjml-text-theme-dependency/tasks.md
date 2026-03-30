## 1. Core Implementation

- [ ] 1.1 Switch `MjmlText` from `useTheme()` to `useOptionalTheme()` and implement pass-through behavior when theme is `null` (no theme-derived props passed to `BaseMjmlText`)
- [ ] 1.2 Add targeted error throws when `variant` or `bottomSpacing` is used without a `ThemeProvider`

## 2. Documentation and Verification

- [ ] 2.1 Update TSDoc on `MjmlText` to note it works without a theme when `variant`/`bottomSpacing` are not used
- [ ] 2.2 Run lint and type checks to verify no regressions
