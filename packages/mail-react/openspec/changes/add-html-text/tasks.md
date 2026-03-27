## 1. Extract Shared Utilities

- [ ] 1.1 Create `src/components/text/textStyles.ts` with `textStyleCssProperties` (moved from `MjmlText.tsx`) and `generateResponsiveTextCss(theme, options)` parameterized by `styleSelector(variantName)` and `spacingSelector(variantName)` callbacks
- [ ] 1.2 Refactor `MjmlText.tsx` to import `textStyleCssProperties` and `generateResponsiveTextCss` from `textStyles.ts`, replacing the inlined logic. `generateTextStyles` becomes a thin wrapper passing MjmlText-specific selectors.
- [ ] 1.3 Verify existing MjmlText tests still pass after refactor

## 2. Component Implementation

- [ ] 2.1 Create `src/components/text/HtmlText.tsx` with `HtmlTextProps` type and `HtmlText` component that renders a `<td>` with theme-derived inline styles, variant support, `bottomSpacing`, `className` via clsx, `style` merging, and `mso-line-height-rule: exactly` when `lineHeight` is present
- [ ] 2.2 Add `generateHtmlTextStyles` function in the same file using `generateResponsiveTextCss` with `htmlText--*` selectors, registered via `registerStyles`
- [ ] 2.3 Add TSDoc comments to `HtmlText` and `HtmlTextProps`

## 3. Exports

- [ ] 3.1 Export `HtmlText` and `HtmlTextProps` from `src/index.ts`

## 4. Storybook

- [ ] 4.1 Create `src/components/text/__stories__/HtmlText.stories.tsx` with stories: default styles, variants, responsive variants, bottom spacing, and usage inside `MjmlRaw`

## 5. Tests

- [ ] 5.1 Add tests for `HtmlText` covering: base theme styles as inline styles, variant resolution, `bottomSpacing`, `style` prop merging, `className` merging, `mso-line-height-rule`, and native td attributes passthrough
- [ ] 5.2 Add tests for `generateHtmlTextStyles` covering: responsive media queries with `htmlText--*` selectors, compound selector for bottomSpacing, no output when no variants

## 6. Changeset

- [ ] 6.1 Create changeset file in `.changeset/` (monorepo root, two levels up) describing the new `HtmlText` component for `@comet/mail-react`
