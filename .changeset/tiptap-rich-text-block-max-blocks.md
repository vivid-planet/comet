---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Add `maxBlocks` option to `createTipTapRichTextBlock` that limits the maximum number of top-level blocks

The option is available in both the API and admin packages:

- **API**: Validates that the number of top-level blocks does not exceed the limit
- **Admin**: Automatically removes excess blocks when editing (e.g., when pasting or pressing Enter)
