---
"@comet/cms-admin": minor
"@comet/cms-api": minor
"@comet/site-react": minor
"@comet/site-nextjs": minor
---

Change the storage format of TipTapRichTextBlock from TipTap JSON to a limited HTML format

**Admin**: The editor still works with TipTap JSON internally but converts to/from HTML at the storage boundary. New serializer (`tipTapContentToHtml`) and deserializer (`htmlToTipTapContent`) handle the conversion. Block styles are encoded as CSS classes, links as `comet-link://` URLs, and special characters as HTML entities (`&nbsp;`, `&shy;`).

**API**: Replaced TipTap/ProseMirror schema-based validation with strict HTML validation using `htmlparser2`. The validator checks all elements, attributes, and CSS classes against the configured `supports` and `blockStyles`. Removed API-side TipTap extension files that are no longer needed.

**Site**: Added `TipTapRichTextBlockRenderer` component that uses `html-react-parser` to parse the HTML and render it via customizable element renderers. Exported from both `@comet/site-react` and `@comet/site-nextjs`.

BREAKING CHANGE: The `tipTapContent` field type changes from JSON object to HTML string. Existing stored content needs to be migrated.
