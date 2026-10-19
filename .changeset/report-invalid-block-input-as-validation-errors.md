---
"@dextinity/cms-api": patch
---

Report invalid block input as validation errors instead of internal errors

- `createBlocksBlock` and `createOneOfBlock`: Report a `blocks` or `attachedBlocks` value that isn't an array with an `isArray` error. Previously, the mutation failed with `value.filter is not a function`. `createListBlock` reports the same error instead of a generic `nestedValidation` error.
- `ChildBlockInput`: Report a missing non-nullable child block with an `isDefined` error. Previously, the mutation failed with `Missing child block input for '<key>'`.
- `createRichTextBlock`: Add a message to the `isDraftContent` error, which was empty
