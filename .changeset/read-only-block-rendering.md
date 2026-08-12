---
"@comet/cms-admin": minor
---

Add `ReadOnlyBlockRenderInterface`

A block that implements the interface provides a `ReadOnlyComponent` that renders its state without an editing UI. Rich text blocks implement it:

```tsx
const RichTextBlock = createRichTextBlock({ link: LinkBlock });

<RichTextBlock.ReadOnlyComponent state={state} />;
```
