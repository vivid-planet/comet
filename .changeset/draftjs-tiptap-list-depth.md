---
"@comet/cms-api": patch
---

Keep the list nesting when migrating Draft.js content to TipTap

The `migrateFromDraftJs` option of `createTipTapRichTextBlock` ignored the `depth` of Draft.js list items, so nested lists were flattened into a single list. The migration now converts the `depth` into nested TipTap lists.

Nesting is limited by the block's `listLevelMax` option: list items that are indented deeper are placed on the deepest allowed level instead of being dropped.
