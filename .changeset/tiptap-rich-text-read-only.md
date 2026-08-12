---
"@comet/cms-admin": minor
---

Add read-only rendering to the TipTap rich text block

`createTipTapRichTextBlock` now returns a `ReadOnlyComponent` that renders saved content without an editing UI, for showing the content where it must not be editable.

```tsx
const RichTextBlock = createTipTapRichTextBlock();

<RichTextBlock.ReadOnlyComponent state={state} />;
```
