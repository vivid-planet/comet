## Why

MJML ending tags (`mj-raw`, `mj-table`) allow embedding raw HTML for layouts that MJML's component model cannot express. Inside these ending tags, MJML components like `MjmlText` cannot be used — only plain HTML is valid. There is currently no way to render themed, variant-aware text inside these contexts while reusing the existing text theme configuration.

## What Changes

- New `HtmlText` component in `src/components/text/HtmlText.tsx`
- New `HtmlTextProps` type exported from the package
- New shared text utilities in `src/components/text/textStyles.ts` (extracted from `MjmlText.tsx`)
- `MjmlText.tsx` refactored to use the shared utilities instead of inline CSS generation
- Package `src/index.ts` updated to export `HtmlText` and `HtmlTextProps`

## Capabilities

### New Capabilities

- `html-text`: A non-MJML text component that renders a styled `<td>` element using the same theme variants, responsive styles, and bottomSpacing as `MjmlText`, for use inside MJML ending tags and custom HTML table layouts.

### Modified Capabilities

- `mjml-text`: The responsive CSS generation logic is extracted into a shared utility. No behavioral or API changes — only an internal refactor to enable code sharing with `HtmlText`.

## Impact

- `src/components/text/HtmlText.tsx` — new file
- `src/components/text/textStyles.ts` — new file (shared CSS generation extracted from MjmlText)
- `src/components/text/__stories__/HtmlText.stories.tsx` — new Storybook story
- `src/components/text/__tests__/HtmlText.test.tsx` — new tests
- `src/components/text/MjmlText.tsx` — refactored to use shared `textStyles.ts`
- `src/index.ts` — new exports (`HtmlText`, `HtmlTextProps`)
- `.changeset/add-html-text-component.md` — changeset for the new component
