## 1. Rename prop in component source

- [x] 1.1 In `src/components/text/HtmlText.tsx`: rename `component` to `element` in `HtmlTextOwnProps`, `HtmlTextImplementationProps`, `HtmlTextProps`, function overloads, and destructuring. Rename generic `C` to `E`. Rename local variable `Component` to `Element`.
- [x] 1.2 Update TSDoc on the `element` prop (change references from "component" to "element" in description and examples)

## 2. Update tests

- [x] 2.1 In `src/components/text/__tests__/HtmlText.test.tsx`: rename all `component` prop usages to `element` in runtime tests and type-level tests

## 3. Update stories

- [x] 3.1 In `src/components/text/__stories__/HtmlText.stories.tsx`: rename all `component` prop usages to `element`

## 4. Verification

- [x] 4.1 Run `pnpm run lint` and fix any errors
- [x] 4.2 Run `pnpm run test` and verify all tests pass

## 5. Changeset

- [x] 5.1 Update the existing changeset at `.changeset/add-html-text-component.md` to reference `element` instead of `component`
