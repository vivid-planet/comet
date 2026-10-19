---
"@dextinity/cms-api": minor
---

Describe the content a `TipTapRichTextBlock` accepts in the block meta

The block meta of a TipTap rich text field now includes `linkBlock` (the name of the block link marks store their data as) and `contentConfig`, which describes the content the block accepts: the enabled marks, the text blocks with their tags and styles, the list styles, inline styles, placeholders, whether each child block is displayed as a block or inline, and the `maxTextBlocks` and `listLevelMax` limits.

This lets consumers that produce content outside the editor, for instance an AI agent, stick to what the block validates.
