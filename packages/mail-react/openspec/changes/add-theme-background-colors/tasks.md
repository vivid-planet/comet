## 1. Theme type and defaults

- [ ] 1.1 Add `ThemeBackgroundColors` and `ThemeColors` interfaces to `src/theme/themeTypes.ts`; add `colors` property to `Theme`
- [ ] 1.2 Add `colors` to the default theme in `src/theme/defaultTheme.ts` with `body: "#F2F2F2"` and `content: "#FFFFFF"`
- [ ] 1.3 Add `colors` override type and deep-merge logic to `src/theme/createTheme.ts`
- [ ] 1.4 Export `ThemeColors` and `ThemeBackgroundColors` from `src/index.ts`

## 2. Component updates

- [ ] 2.1 Pass `backgroundColor={theme.colors.background.body}` to `MjmlBody` in `src/components/mailRoot/MjmlMailRoot.tsx`
- [ ] 2.2 Apply `theme.colors.background.content` as default `backgroundColor` in `src/components/section/MjmlSection.tsx` when theme is present, with explicit prop taking precedence

## 3. Documentation and stories

- [ ] 3.1 Update TSDoc on `ThemeBackgroundColors`, `ThemeColors`, and the `colors` property on `Theme`
- [ ] 3.2 Update Storybook stories for `MjmlMailRoot` and `MjmlSection` to demonstrate the background color behavior

## 4. Verification

- [ ] 4.1 Run lint and type checks (`pnpm run lint`)
- [ ] 4.2 Run tests (`pnpm run test`)
- [ ] 4.3 Create changeset file in `.changeset/` describing the new theme background color defaults
