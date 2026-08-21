---
"@dextinity/cms-admin": minor
---

Add a `readOnly` prop to the rich text blocks' `AdminComponent`

The rich text blocks (`createRichTextBlock` and `createTipTapRichTextBlock`) render their state without an editing UI when `AdminComponent` gets `readOnly`. A read-only caller can omit `updateState`.

`ReadOnlyComponent` and `ReadOnlyBlockRenderInterface` are deprecated in favor of it. They still work, so existing code keeps running.

A block declares the capability with the new `ReadOnlyRenderableAdminComponent` interface, which replaces `AdminComponent` on the block type:

```tsx
type MyRichTextBlock = Omit<BlockInterface<Data, State, Input>, "AdminComponent"> & ReadOnlyRenderableAdminComponent<State>;
```

**Example**

```tsx
<RichTextBlock.AdminComponent state={state} readOnly />
```
