---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Add `"ordered-list"` and `"unordered-list"` to `TipTapBlockType`

`blockStyles` in `createTipTapRichTextBlock` can now target list items using `appliesTo: ["ordered-list"]` and/or `appliesTo: ["unordered-list"]`. When the cursor is inside a list item, the block style dropdown in the toolbar shows only styles applicable to the current list type.
