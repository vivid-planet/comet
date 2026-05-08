## Why

`HtmlText` currently always renders a `<td>`. Inside MJML ending tags or outside of the MJML context, consumers sometimes need themed text in a `<div>`, `<span>`, `<a>`, or other HTML elements. There is no way to reuse the theme-driven text styling without the `<td>` wrapper.

## What Changes

- `HtmlText` gains an optional `component` prop that accepts an HTML element type (e.g., `"div"`, `"span"`, `"a"`), defaulting to `"td"`
- `HtmlTextProps` becomes a generic type parameterized by the element type, exposing the correct HTML attributes for the chosen element (e.g., `href` only available when `component="a"`)
- The `HtmlText` function uses TypeScript function overloads to provide type-safe props without `as` assertions
- Type-level tests using `@ts-expect-error` verify that invalid prop combinations are rejected

## Capabilities

### New Capabilities

- `html-text-component-prop`: Polymorphic `component` prop on `HtmlText` with element-specific type safety

### Modified Capabilities

- `html-text`: The rendered element, props type, forwarded attributes, CSS class structure, and stories change to support the `component` prop

## Impact

- `src/components/text/HtmlText.tsx` — component and type changes
- `src/components/text/__tests__/HtmlText.test.tsx` — new tests for component prop behavior and type-level tests
- `src/components/text/__stories__/HtmlText.stories.tsx` — new stories demonstrating component prop usage
- `src/index.ts` — export updated `HtmlTextProps` (now generic)
- Public API: `HtmlTextProps` changes from a plain type to a generic (`HtmlTextProps<C>`), but defaults to `"td"` so existing usage is unaffected
