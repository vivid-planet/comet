## Why

Outlook Desktop (2007–2019, Office 365) uses Microsoft Word as its HTML rendering engine, which applies a built-in "Hyperlink" character style to `<a>` tags — overriding natural CSS inheritance with blue color and Times New Roman. The CSS `inherit` keyword does not work as a workaround because Word only supports CSS Level 1, which predates `inherit`. Consumers currently have no way to render inline links that match the surrounding text styles in Outlook without manually duplicating font values on every `<a>` tag.

## What Changes

- New `HtmlInlineLink` component exported from the main entry point, rendering an `<a>` tag with explicit text styles from context for Outlook compatibility, with a responsive `inherit !important` reset at the default breakpoint for modern clients
- New `HtmlInlineLinkProps` type exported from the main entry point
- New internal `OutlookTextStyleContext` module (`src/components/text/OutlookTextStyleContext.tsx`) providing a React context, provider component, hook, and type (not exported — internal wiring between text components and `HtmlInlineLink`)
- `HtmlText` updated to wrap its children in an `OutlookTextStyleProvider`, passing resolved text styles through context
- `MjmlText` updated to wrap its children in an `OutlookTextStyleProvider`, passing resolved text styles through context
- Storybook stories for `HtmlInlineLink`

## Capabilities

### New Capabilities

- `html-inline-link`: The `HtmlInlineLink` component and its Outlook-compatible styling behavior
- `outlook-text-style-context`: The `OutlookTextStyleContext` React context, provider, hook, and type that bridges resolved text styles to inline descendants for Outlook compatibility

### Modified Capabilities

- `html-text`: `HtmlText` wraps children in an `OutlookTextStyleProvider`
- `mjml-text`: `MjmlText` wraps children in an `OutlookTextStyleProvider`

## Impact

- **Exports**: `HtmlInlineLink`, `HtmlInlineLinkProps` added to `src/index.ts`
- **Components**: `HtmlText` and `MjmlText` gain an internal provider wrapper around children (no API change, no breaking behavior)
- **New files**: `src/components/text/OutlookTextStyleContext.tsx`, `src/components/inlineLink/HtmlInlineLink.tsx`, `src/components/inlineLink/__stories__/HtmlInlineLink.stories.tsx`
- **Dependencies**: None new (uses React context, already a peer dependency)
