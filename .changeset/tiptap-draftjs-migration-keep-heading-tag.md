---
"@comet/cms-api": patch
---

Keep the text block type when the Draft.js → TipTap migration maps a block type to a `textBlockStyle`

A Draft.js block type listed in `migrateFromDraftJs.textBlockStyleMap` was always converted to a paragraph, so a `header-two` block mapped to a `headline450` style lost its heading tag and was rendered with whatever tag the style defaults to. Mapped header types now keep their heading level and only receive the mapped `textBlockStyle`.

For custom Draft.js block types that were rendered as a heading (e.g. a `headline450` block type rendered as `<h2>`), the target text block type can now be set explicitly by passing an object instead of a style name:

**Example**

```ts
createTipTapRichTextBlock({
    textBlockStyles: [{ name: "headline450", appliesTo: ["heading-2"] }],
    migrateFromDraftJs: {
        textBlockStyleMap: { headline450: { textBlockType: "heading-2", textBlockStyle: "headline450" } },
    },
});
```

`textBlockType` accepts `paragraph` and `heading-1` … `heading-6`, and both properties are optional.
