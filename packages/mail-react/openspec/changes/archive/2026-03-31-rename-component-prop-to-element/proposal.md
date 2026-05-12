## Why

The `HtmlText` component's `component` prop only accepts `keyof JSX.IntrinsicElements` (HTML element tag names), but the name `component` — borrowed from MUI's polymorphic pattern — implies support for React components (the broader `ElementType`). This creates a false expectation that `<HtmlText component={MyFancyText}>` should work. Renaming to `element` makes the constraint self-documenting.

## What Changes

- Rename `HtmlText`'s `component` prop to `element`
- Rename the generic type parameter in `HtmlTextProps` from `C` to `E` to reflect "element"
- Update the `HtmlTextImplementationProps` interface to use `element` instead of `component`
- Update function overloads and destructuring to use `element`
- Update TSDoc on the prop to reference `element`
- Update all tests to use `element` instead of `component`
- Update all Storybook stories to use `element` instead of `component`
- Update the existing changeset (`.changeset/add-html-text-component.md`) to reference `element`

## Capabilities

### New Capabilities

_None_

### Modified Capabilities

- `html-text`: The `component` prop and its generic are renamed to `element`

## Impact

- **Exports**: `HtmlTextProps` generic parameter name changes (from `C` to `E`)
- **Not a breaking change**: The `component` prop was added in an unmerged PR, so no consumers are affected yet
- **Files affected**:
  - `src/components/text/HtmlText.tsx`
  - `src/components/text/__tests__/HtmlText.test.tsx`
  - `src/components/text/__stories__/HtmlText.stories.tsx`
  - `openspec/specs/html-text/spec.md`
  - `.changeset/add-html-text-component.md` (update existing changeset)
