---
"@dextinity/cms-admin": minor
---

Add `isTipTapRichTextEmpty`

The TipTap counterpart of `isRichTextEmpty`: it returns `true` when the `tipTapContent` of a `createTipTapRichTextBlock` block holds neither text nor a child block.
It takes the content rather than the block state, so it works with the block's data and its state alike.

```ts
if (isTipTapRichTextEmpty(notes.tipTapContent)) {
    // show a placeholder
}
```
