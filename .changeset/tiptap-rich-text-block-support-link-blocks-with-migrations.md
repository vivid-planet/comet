---
"@comet/cms-api": patch
---

Support link blocks with migrations in the TipTap rich text block

A link block nested inside a TipTap rich text block (configured via the `link` option of `createTipTapRichTextBlock`) can now define block migrations.

Previously, once a migration had run on the nested link block, its data carried the internal `$$version` migration metadata. This metadata is stamped into the `tipTapContent` JSON on save and was rejected by the TipTap input validator. The validator now strips `$$version` from link block data before validating it.
