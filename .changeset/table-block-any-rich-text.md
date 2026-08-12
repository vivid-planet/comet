---
"@comet/cms-admin": minor
---

Accept any rich text block in `createTableBlock`, such as TipTap

The `richText` option accepts any block that implements `ReadOnlyBlockRenderInterface`:

```ts
const TipTapRichTextBlock = createTipTapRichTextBlock(...);

createTableBlock({ richText: TipTapRichTextBlock, name: "TipTapTable" });
```
