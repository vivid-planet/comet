---
"@comet/cms-api": patch
---

Return a fully typed `Block` from `createTipTapRichTextBlock`

The factory previously returned the default `Block` type, whose `blockDataFactory`/`blockInputFactory` did not expose the `tipTapContent` data. This made the block hard to use in typed code such as fixtures. It now returns `Block<TipTapRichTextBlockDataInterface, TipTapRichTextBlockInputInterface>`, so `tipTapContent` is typed on both the block data and input (matching the behavior of the DraftJS-based `createRichTextBlock`).
