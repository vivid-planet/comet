---
"@comet/cms-admin": minor
---

Add `defaultTextBlockStyleLabel` option to `createTipTapRichTextBlock`

The first entry of the text block style dropdown applies no style and was always labeled `Default`. `defaultTextBlockStyleLabel` sets that label, so a block can name the entry after the base style its site renders when no style is stored.

Only the label changes: selecting the entry still stores no text block style. Omitting the option keeps `Default`.

**Example**

```tsx
createTipTapRichTextBlock({
    defaultTextBlockStyleLabel: "Copy 100",
    textBlockStyles: [
        { name: "copy-200", label: "Copy 200", appliesTo: ["paragraph"], element: (props) => <p {...props} /> },
        { name: "label-100", label: "Label 100", appliesTo: ["paragraph"], element: (props) => <p {...props} /> },
        { name: "label-200", label: "Label 200", appliesTo: ["paragraph"], element: (props) => <p {...props} /> },
    ],
});
```
