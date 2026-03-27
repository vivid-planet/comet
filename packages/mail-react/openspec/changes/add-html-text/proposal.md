## Why

MJML ending tags (like `mj-raw`, `mj-table`) allow embedding raw HTML for custom layouts that MJML's component model cannot express. Inside these ending tags, MJML components like `MjmlText` cannot be used — only plain HTML is valid. There is currently no way to render themed, variant-aware text inside these contexts while reusing the existing text theme configuration.

## What Changes

- New `HtmlText` component in `src/components/text/HtmlText.tsx`
- New `HtmlTextProps` type exported from the package
- New `generateHtmlTextStyles` function that registers responsive CSS with `htmlText--*` class selectors
- Package `src/index.ts` updated to export `HtmlText` and `HtmlTextProps`

## Capabilities

### New Capabilities

- `html-text`: A non-MJML text component that renders a styled `<td>` element using the same theme variants, responsive styles, and bottomSpacing as `MjmlText`, for use inside MJML ending tags and custom HTML table layouts.

### Modified Capabilities

_(none)_

## Impact

- `src/components/text/HtmlText.tsx` — new file
- `src/components/text/__stories__/HtmlText.stories.tsx` — new Storybook story
- `src/index.ts` — new exports (`HtmlText`, `HtmlTextProps`)
- Styles registry gains additional responsive CSS entries (one per variant, same pattern as `MjmlText`)
- No changes to existing components or APIs
