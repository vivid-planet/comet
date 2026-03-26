## 1. Theme Types and Defaults

- [x] 1.1 Add `TextStyles`, `TextVariantStyles`, `TextVariants`, and `ThemeText` interfaces to `src/theme/themeTypes.ts`; add `text: ThemeText` to `Theme` interface
- [x] 1.2 Add default `text: { fontFamily: "Arial, sans-serif", fontSize: "16px", lineHeight: "20px", bottomSpacing: 16 }` to `src/theme/defaultTheme.ts`
- [x] 1.3 Update `createTheme` in `src/theme/createTheme.ts` to shallow-merge `text` overrides with defaults
- [x] 1.4 Export new type interfaces from `src/index.ts`

## 2. MjmlMailRoot Update

- [x] 2.1 Update `MjmlMailRoot` to pass `theme.text.fontFamily` to `<MjmlAll>` as `fontFamily` attribute
- [x] 2.2 Update MjmlMailRoot Storybook story and TSDoc if needed

## 3. MjmlText Component

- [x] 3.1 Create `src/components/text/MjmlText.tsx` with `MjmlTextProps` type and internal `resolveTextStyles` helper (pure function for variant resolution, style merging, defaultVariant fallback, bottomSpacing gating); component delegates to helper and forwards result as props to base `MjmlText`
- [x] 3.2 Add `registerStyles` call for responsive variant overrides (media queries per variant per style key, including `bottomSpacing` scoped to `.mjmlText--bottomSpacing.mjmlText--{variant}`)
- [x] 3.3 Update `src/index.ts`: replace `MjmlText` re-export with custom component, export `MjmlTextProps`
- [x] 3.4 Add TSDoc comments to `MjmlText` component and `MjmlTextProps` type

## 4. Storybook and Documentation

- [x] 4.1 Create `src/components/text/__stories__/MjmlText.stories.tsx` with the following stories:
  - Default (no variants): base styles from the default theme
  - With Variants: defines heading/body/caption variants via `createTheme`, shows each
  - Responsive Variants: variants with responsive values, demonstrates breakpoint behavior
  - Bottom Spacing: with and without `bottomSpacing` prop
  - Default Variant: sets `defaultVariant` in theme, shows implicit variant on unstyled `MjmlText`
  - Stories use `@ts-expect-error` (not module augmentation) for variant keys in theme definitions and `variant` props, with a comment explaining that consumers would use module augmentation of `TextVariants`
  - Custom themes are passed via `parameters: { theme }` (existing decorator support)

## 5. Tests

- [x] 5.1 Unit tests for `resolveTextStyles` helper (`src/components/text/__tests__/resolveTextStyles.test.ts`): base-only styles, variant override, defaultVariant fallback, bottomSpacing gating (true/false/no theme value), explicit prop override, no variant active
- [x] 5.2 Unit tests for registerStyles CSS generation (`src/components/text/__tests__/registerStyles.test.ts`): responsive variant emits media query with `!important`, responsive bottomSpacing targets compound selector `.mjmlText--bottomSpacing.mjmlText--{variant}`, non-responsive variant values produce no media queries, no variants produces empty CSS
- [x] 5.3 Unit tests for createTheme text merging (`src/theme/createTheme.test.ts` — extend existing file): text overrides shallow-merged with defaults, variant passthrough
- [x] 5.4 Integration smoke tests via renderMailHtml (`src/components/text/__tests__/MjmlText.test.tsx`): base theme styles present in output, variant styles present, responsive media queries present in `<style>` block, no MJML warnings

## 6. Changeset

- [x] 6.1 Create changeset file in `.changeset/` describing the addition of theme-based text styling and variant support to `MjmlText`, and the new `fontFamily` default in `MjmlMailRoot`
