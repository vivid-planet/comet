## 1. Types and Component

- [x] 1.1 Add `HtmlTextOwnProps` type, generic `HtmlTextProps<C>` type, and function overload signatures to `HtmlText.tsx`
- [x] 1.2 Update the `HtmlText` implementation to accept `component` prop and use conditional rendering (if/else for custom element vs `<td>`)
- [x] 1.3 Update the `HtmlTextProps` export in `src/index.ts` (now generic)
- [x] 1.4 Update TSDoc on `HtmlText` and `HtmlTextProps` to document the `component` prop

## 2. Tests

- [x] 2.1 Add runtime tests for `component` prop: renders the specified element, applies theme styles and CSS classes to non-td elements, forwards element-specific attributes
- [x] 2.2 Add type-level tests using `@ts-expect-error`: `href` rejected without `component="a"`, `colSpan` rejected on `component="a"`, own props accepted with any component

## 3. Stories and Changeset

- [x] 3.1 Add Storybook stories demonstrating `component` prop usage (e.g., as `<div>`, as `<a>` with `href`)
- [x] 3.2 Create changeset file in `.changeset/` describing the new `component` prop on `HtmlText`
