## 1. Dependencies & Style Registration Mechanism

- [ ] 1.1 Add `clsx` as a production dependency
- [ ] 1.2 Create `src/styles/registerStyles.ts` with the module-scoped `Map` registry and `registerStyles` (keyed by styles identity); type the `styles` parameter as `ReturnType<typeof css> | ((theme: Theme) => ReturnType<typeof css>)` by importing `css` from `../utils/css.js` for `typeof` only (no new exported type alias)
- [ ] 1.3 Create `src/styles/Styles.tsx` with an internal `<Styles />` component that iterates the registry and renders `<MjmlStyle>` elements, resolving theme functions via `useTheme()` (do not export from the package)
- [ ] 1.4 Export only `registerStyles` from `src/index.ts`

## 2. ResponsiveValue Type & Helpers

- [ ] 2.1 Create `src/theme/responsiveValue.ts` with generic `ResponsiveValue<T = number>` as `T | (Partial<Record<keyof ThemeBreakpoints, T>> & { default: T })`
- [ ] 2.2 Implement `getDefaultValue<T = number>(value: ResponsiveValue<T>): T` in the same file
- [ ] 2.3 Implement `getResponsiveOverrides<T = number>(value: ResponsiveValue<T>): Array<{ breakpointKey: string; value: T }>` in the same file
- [ ] 2.4 Export `ResponsiveValue`, `getDefaultValue`, and `getResponsiveOverrides` from `src/index.ts`
- [ ] 2.5 Add tests for `getDefaultValue` and `getResponsiveOverrides` covering plain number, object with default only, object with multiple breakpoint keys, and at least one string-typed case (`ResponsiveValue<string>`)

## 3. Theme Extension

- [ ] 3.1 Add `contentIndentation` of type `ResponsiveValue` (default `T` is `number`; do not write `ResponsiveValue<number>`) to `ThemeSizes` in `src/theme/themeTypes.ts` with TSDoc comments
- [ ] 3.2 Add default value (`contentIndentation: { default: 20, mobile: 10 }`) to `src/theme/defaultTheme.ts`
- [ ] 3.3 Add tests for the new default value and override behavior (number and object forms) in the theme test file

## 4. MjmlMailRoot Update

- [ ] 4.1 Import and render `<Styles />` inside `<MjmlHead>` in `src/components/mailRoot/MjmlMailRoot.tsx`, after the `<MjmlBreakpoint>` element
- [ ] 4.2 Add or update the integration test in `src/server/renderMailHtml.test.tsx` to verify registered styles appear in the rendered HTML

## 5. MjmlSection Indentation

- [ ] 5.1 Add `indent` boolean prop to `MjmlSectionProps` in `src/components/section/MjmlSection.tsx`
- [ ] 5.2 Apply the BEM block class `mjmlSection` always, and the modifier `mjmlSection--indented` when `indent` is true, merging with consumer `className` via `clsx`
- [ ] 5.3 Implement default indentation: when `indent` is true, set `paddingLeft` and `paddingRight` from `getDefaultValue(theme.sizes.contentIndentation)`
- [ ] 5.4 Register responsive indentation styles at module scope via `registerStyles`, iterating `getResponsiveOverrides(theme.sizes.contentIndentation)` and generating a media query per breakpoint key targeting `.mjmlSection--indented`
- [ ] 5.5 Update TSDoc on the component and props to document the `indent` prop

## 6. Storybook & Documentation

- [ ] 6.1 Add a Storybook story for `MjmlSection` with `indent` enabled, showing the indentation behavior (no separate story for default `indent` off — that is already the default)

## 7. Changesets

- [ ] 7.1 Create a changeset at the monorepo root for styling utilities: `registerStyles`, internal registered-styles rendering in `MjmlMailRoot`, and generic `ResponsiveValue` with `getDefaultValue` / `getResponsiveOverrides` (no `contentIndentation` in this entry — that reads as section UX from consumers’ perspective)
- [ ] 7.2 Create a changeset at the monorepo root for section indentation: `sizes.contentIndentation` on `ThemeSizes` (with defaults), optional `indent` on `MjmlSection`, and a short note that indentation values are driven by that theme field
