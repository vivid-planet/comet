## 1. Theme Types and Defaults

- [x] 1.1 Add `TextStyleMap`, `TextStyles`, `TextVariantStyles`, `TextVariants`, `VariantsRecord`, `VariantName`, and `ThemeText` to `src/theme/themeTypes.ts`; add `text: ThemeText` to `Theme` interface
- [x] 1.2 Add default `text` values to `src/theme/defaultTheme.ts`: `fontFamily: "Arial, sans-serif"`, `fontSize: "16px"`, `lineHeight: "20px"`, `bottomSpacing: 16`
- [x] 1.3 Update `createTheme` in `src/theme/createTheme.ts` to shallow-merge `text` overrides with defaults
- [x] 1.4 Export new type interfaces from `src/index.ts`: `TextStyles`, `TextVariantStyles`, `TextVariants`, `ThemeText`

## 2. MjmlMailRoot Update

- [x] 2.1 Update `MjmlMailRoot` to pass `theme.text.fontFamily` to `<MjmlAll>` as `fontFamily` attribute
- [x] 2.2 Update MjmlMailRoot Storybook story if needed to reflect the new `fontFamily` default

## 3. MjmlText Component

- [x] 3.1 Add `getDefaultOrUndefined` helper to `src/theme/responsiveValue.ts` (internal utility, not exported from package)
- [x] 3.2 Create `src/components/text/MjmlText.tsx` with `MjmlTextProps` type, spread-based merge for base + variant styles, explicit per-property inline prop extraction using `getDefaultOrUndefined`, `fontWeight` conversion via `String()`, `bottomSpacing` as `paddingBottom`, and CSS class structure via `clsx`
- [x] 3.3 Add `collectOverride` helper and `registerStyles` call in `MjmlText.tsx` for breakpoint-grouped responsive variant CSS generation
- [x] 3.4 Update `src/index.ts`: replace `MjmlText` re-export with custom component export, export `MjmlTextProps`
- [x] 3.5 Add TSDoc comments to `MjmlText` component and `MjmlTextProps` type

## 4. Storybook

- [x] 4.1 Create `src/components/text/__stories__/MjmlText.stories.tsx` with stories: Default, With Variants, Responsive Variants, Bottom Spacing, Default Variant. Stories use `@ts-expect-error` for variant keys with explanatory comments. Custom themes via `parameters: { theme }`.

## 5. Tests

- [x] 5.1 Unit tests for `getDefaultOrUndefined` helper in `src/theme/responsiveValue.test.ts`
- [x] 5.2 Unit tests for `createTheme` text merging in `src/theme/createTheme.test.ts`: text overrides shallow-merged with defaults, variant passthrough
- [x] 5.3 Smoke test via `renderMailHtml` in `src/components/text/__tests__/MjmlText.test.tsx`: render MjmlText with a variant theme and assert no MJML warnings (validates the component produces valid MJML structure)
- [x] 5.4 Unit tests for `registerStyles` CSS output in `src/components/text/__tests__/MjmlText.test.tsx`: test the CSS generation function directly — given a theme with variants, verify correct selector construction (`.mjmlText--{variant} > div`, `.mjmlText--bottomSpacing.mjmlText--{variant}`), breakpoint grouping, and `!important` declarations

## 6. Changeset

- [x] 6.1 Create changeset file in `.changeset/` (at monorepo root) describing: addition of `variant` and `bottomSpacing` props to `MjmlText`, theme-based text styling with `ThemeText`, and `fontFamily` default attribute in `MjmlMailRoot`
