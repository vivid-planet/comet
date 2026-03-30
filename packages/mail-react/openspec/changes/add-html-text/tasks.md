## 1. Extract shared text utilities

- [x] 1.1 Create `src/components/text/textStyles.ts` with `textStyleCssProperties` mapping and `generateResponsiveTextCss(theme, options)` function extracted from `MjmlText.tsx`
- [x] 1.2 Refactor `MjmlText.tsx` to import from `textStyles.ts` and use `generateResponsiveTextCss` with MjmlText-specific selectors

## 2. HtmlText component

- [x] 2.1 Create `src/components/text/HtmlText.tsx` with `HtmlTextProps` type and `HtmlText` component rendering a themed `<td>` with inline styles
- [x] 2.2 Register responsive styles via `registerStyles` using `generateResponsiveTextCss` with HtmlText-specific selectors
- [x] 2.3 Add TSDoc comments to `HtmlText` and `HtmlTextProps` (similar to `MjmlText`)
- [x] 2.4 Export `HtmlText` and `HtmlTextProps` from `src/index.ts`

## 3. Tests and stories

- [x] 3.1 Create `src/components/text/__tests__/HtmlText.test.tsx` with tests covering base styles, variants, bottomSpacing, className, style overrides, and mso-line-height-rule
- [x] 3.2 Create `src/components/text/__stories__/HtmlText.stories.tsx` with Default, With Variants, Responsive Variants, Bottom Spacing, and Default Variant stories

## 4. Changeset

- [x] 4.1 Create `.changeset/add-html-text-component.md` describing the new `HtmlText` component for consumers
