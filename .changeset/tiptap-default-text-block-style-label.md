---
"@comet/cms-admin": minor
---

Add `defaultTextBlockStyleLabel` option to `createTipTapRichTextBlock`

The text block style dropdown always showed `Default` for the entry that applies no style. When a block configures named styles such as `Paragraph Default` and `Paragraph Small`, that fixed `Default` is inconsistent with the styles it sits next to.

`defaultTextBlockStyleLabel` lets the block relabel that entry so it matches the block's naming. It only changes the label — selecting the entry still stores no text block style — and when the option is omitted the entry stays labeled `Default`.

**Example**

```tsx
createTipTapRichTextBlock({
    defaultTextBlockStyleLabel: "Paragraph Default",
    textBlockStyles: [{ name: "small", label: "Paragraph Small", appliesTo: ["paragraph"], element: (props) => <p {...props} /> }],
});
```
