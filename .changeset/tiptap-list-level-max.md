---
"@comet/cms-admin": minor
"@comet/cms-api": minor
---

Add `listLevelMax` option to `createTipTapRichTextBlock` that limits the maximum number of nested list levels

The option can be set in both the API and admin configurations. It enforces the limit via:

- API validation that rejects content exceeding the max nesting depth
- Admin editor: disables the indent toolbar button when at max depth
- Admin editor: prevents Tab key from indenting beyond the limit
- Admin editor: clips pasted content to respect the nesting limit
