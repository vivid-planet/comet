---
"@comet/cms-api": major
"@comet/cms-admin": major
---

Change `TipTapRichTextBlock` storage format from TipTap JSON to comet-flavoured markdown

The block data is now stored as a markdown string instead of TipTap JSONContent. The editor still uses TipTap internally, but serializes to/from markdown at the I/O boundary.

**API changes:**

- The block field is now `markdown: string` instead of `tipTapContent: Record<string, any>`
- All TipTap/ProseMirror dependencies have been removed from `@comet/cms-api`
- Validation is now based on custom markdown parsing instead of ProseMirror schema
- Block styles use `[.styleName]` prefix syntax in markdown
- Links use `[text](comet-link://BASE64_JSON)` format with base64-encoded link data

**Admin changes:**

- New `tipTapJsonToMarkdown()` and `markdownToTipTapJson()` converter functions
- `input2State` now parses markdown → TipTap JSONContent for the editor
- `state2Output` now serializes TipTap JSONContent → markdown for storage
- The internal editor state (`TipTapRichTextBlockState`) remains unchanged

**Markdown specification:**

- `**bold**`, `*italic*`, `~~strike~~`
- `^superscript^`, `~subscript~`
- U+00A0 for non-breaking space, U+00AD for soft hyphen
- `# Heading 1` through `###### Heading 6`
- `- item` for unordered lists, `1. item` for ordered lists
- `[.styleName]` prefix for block styles
- `[text](comet-link://BASE64)` for CMS links

**Migration required:** Existing data must be migrated from TipTap JSON to the new markdown format.
