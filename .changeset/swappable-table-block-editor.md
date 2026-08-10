---
"@comet/cms-admin": minor
---

Make the table block's rich text editor swappable

A table's cells can use any rich text block that implements `ReadOnlyBlockRenderInterface`:

```ts
createTableBlock({ richText: TipTapRichTextBlock, name: "TipTapTable" });
```
