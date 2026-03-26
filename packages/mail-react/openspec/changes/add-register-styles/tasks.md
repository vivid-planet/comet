## 1. Dependencies & Style Registration Mechanism

- [x] 1.1 Add `clsx` as a production dependency
- [x] 1.2 Create `src/styles/registerStyles.ts` with the module-scoped `Map` registry and `registerStyles` (keyed by styles identity); type the `styles` parameter as `ReturnType<typeof css> | ((theme: Theme) => ReturnType<typeof css>)` by importing `css` from `../utils/css.js` for `typeof` only (no new exported type alias)
- [x] 1.3 Create `src/styles/Styles.tsx` with an internal `<Styles />` component that iterates the registry and renders `<MjmlStyle>` elements, resolving theme functions via `useTheme()` (do not export from the package)
- [x] 1.4 Export only `registerStyles` from `src/index.ts`

## 2. ResponsiveValue Type & Helpers

- [x] 2.1 Create `src/theme/responsiveValue.ts` with generic `ResponsiveValue<T = number>` as `T | (Partial<Record<keyof ThemeBreakpoints, T>> & { default: T })`
- [x] 2.2 Implement `getDefaultValue<T = number>(value: ResponsiveValue<T>): T` in the same file
- [x] 2.3 Implement `getResponsiveOverrides<T = number>(value: ResponsiveValue<T>): Array<{ breakpointKey: string; value: T }>` in the same file
- [x] 2.4 Export `ResponsiveValue`, `getDefaultValue`, and `getResponsiveOverrides` from `src/index.ts`
- [x] 2.5 Add tests for `getDefaultValue` and `getResponsiveOverrides` covering plain number, object with default only, object with multiple breakpoint keys, and at least one string-typed case (`ResponsiveValue<string>`)

## 3. Theme Extension

- [x] 3.1 Add `contentIndentation` of type `ResponsiveValue` (default `T` is `number`; do not write `ResponsiveValue<number>`) to `ThemeSizes` in `src/theme/themeTypes.ts` with TSDoc comments
- [x] 3.2 Add default value (`contentIndentation: { default: 32, mobile: 16 }`) to `src/theme/defaultTheme.ts`
- [x] 3.3 Add tests for the new default value and override behavior (number and object forms) in the theme test file

## 4. MjmlMailRoot Update

- [x] 4.1 Import and render `<Styles />` inside `<MjmlHead>` in `src/components/mailRoot/MjmlMailRoot.tsx`, after the `<MjmlBreakpoint>` element
- [x] 4.2 Add or update the integration test in `src/server/renderMailHtml.test.tsx` to verify registered styles appear in the rendered HTML

## 5. MjmlSection Indentation

- [x] 5.1 Add `indent` boolean prop to `MjmlSectionProps` in `src/components/section/MjmlSection.tsx`
- [x] 5.2 Apply the BEM block class `mjmlSection` always, and the modifier `mjmlSection--indented` when `indent` is true, merging with consumer `className` via `clsx`
- [x] 5.3 Implement default indentation: when `indent` is true, set `paddingLeft` and `paddingRight` from `getDefaultValue(theme.sizes.contentIndentation)`
- [x] 5.4 Register responsive indentation styles at module scope via `registerStyles`, iterating `getResponsiveOverrides(theme.sizes.contentIndentation)` and generating a media query per breakpoint key targeting `.mjmlSection--indented`
- [x] 5.5 Update TSDoc on the component and props to document the `indent` prop

## 6. Storybook & Documentation

- [x] 6.1 Add a Storybook story for `MjmlSection` with `indent` enabled, showing the indentation behavior (no separate story for default `indent` off — that is already the default)

## 7. Changesets

- [x] 7.1 Create a changeset for `registerStyles` and internal registered-styles rendering in `MjmlMailRoot`
- [x] 7.2 Create a changeset for `ResponsiveValue<T>` type with `getDefaultValue` and `getResponsiveOverrides` helpers
- [x] 7.3 Create a changeset for section indentation: `indent` prop on `MjmlSection` with `sizes.contentIndentation` on `ThemeSizes`
