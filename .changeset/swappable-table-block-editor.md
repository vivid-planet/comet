---
"@comet/cms-admin": minor
---

Make the `TableBlock` rich text editor swappable

`createTableBlock` no longer hardcodes the draft-js `RichTextBlock` for its cells. It is now generic over the injected rich text block, so a project can build a table whose cells use any rich text block that implements the new `ReadOnlyBlockRenderInterface`. draft-js stays the default, so existing usages keep working unchanged.

Both built-in rich text blocks implement `ReadOnlyBlockRenderInterface`: `createRichTextBlock` (draft-js) and the experimental `createTipTapRichTextBlock`. A custom rich text block only needs to add a `RenderReadOnly` component to be usable in a table:

```ts
const MyRichText: BlockInterface & ReadOnlyBlockRenderInterface = {
    /* ...block methods..., */
    RenderReadOnly: ({ state }) => <MyReadOnlyView state={state} />,
};

createTableBlock({ richText: MyRichText });
```

Add a `name` option to `createTableBlock` so a project can register more than one table block (for example one draft-js table and one TipTap table):

```ts
createTableBlock({ richText: TipTapRichTextBlock, name: "TipTapTable" });
```
