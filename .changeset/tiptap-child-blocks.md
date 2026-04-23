---
"@comet/cms-admin": minor
"@comet/cms-api": minor
---

Add `childBlocks` option to `createTipTapRichTextBlock`

Add support for embedding child blocks (e.g., images, videos, CTAs) within the TipTap rich text editor.

**Admin:**

- Add `childBlocks` option accepting an array of `BlockInterface` instances
- Add "+" toolbar button that opens a menu listing all available child blocks by their `displayName`
- Open a dialog with the child block's `AdminComponent` when adding or editing a block
- Render child blocks as non-editable, clickable previews within the editor
- Support editing by clicking the block and deleting via a delete button
- Transform child block data through the standard block lifecycle methods (`input2State`, `state2Output`, `output2State`, `createPreviewState`)

**API:**

- Add `childBlocks` option accepting a `Record<string, Block>` mapping block type names to block instances
- Add `childBlock` TipTap node extension to the ProseMirror schema for validation
- Validate child block data in `@IsTipTapContent` decorator
- Transform child block data through block factories (`blockDataFactory`, `blockInputFactory`)
- Report child blocks in `childBlocksInfo()` for dependency tracking

**Example usage (Admin):**

```tsx
const TipTapRichTextBlock = createTipTapRichTextBlock({
    link: LinkBlock,
    childBlocks: [ImageBlock, VideoBlock],
});
```

**Example usage (API):**

```ts
const TipTapRichTextBlock = createTipTapRichTextBlock({
    link: LinkBlock,
    childBlocks: {
        Image: ImageBlock,
        Video: VideoBlock,
    },
});
```
