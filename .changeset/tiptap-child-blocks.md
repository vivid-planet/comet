---
"@comet/cms-admin": minor
"@comet/cms-api": minor
---

Add support for child blocks in `createTipTapRichTextBlock`

Child blocks can now be embedded into the TipTap rich text editor, similar to the existing link feature. Pass an array of blocks via the new `childBlocks` option (both admin and API). A "+" button in the toolbar opens a menu listing the configured child blocks. Selecting one opens a dialog with the block's Admin component; on confirmation, the block is inserted into the editor as a non-editable preview that can be edited (by clicking it) or removed.

**Example**

```tsx
createTipTapRichTextBlock({
    childBlocks: { productPrice: { block: ProductPriceBlock, display: "inline" } },
});
```
