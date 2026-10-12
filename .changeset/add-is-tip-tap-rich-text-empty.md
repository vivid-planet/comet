---
"@dextinity/cms-admin": minor
---

Add `isTipTapRichTextEmpty`

The TipTap counterpart of `isRichTextEmpty`: it returns `true` when the state of a `createTipTapRichTextBlock` block holds neither text nor a child block.

```ts
if (isTipTapRichTextEmpty(DealerNotesBlock.input2State(notes))) {
    // show a placeholder
}
```
