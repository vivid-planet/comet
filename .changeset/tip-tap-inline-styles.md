---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Add `inlineStyles` option to `createTipTapRichTextBlock`

Similar to `blockStyles` which applies styling to entire blocks, `inlineStyles` allows configuring custom inline mark styles that can be applied to selected text ranges.

**API:**

```ts
const TipTapRichTextBlock = createTipTapRichTextBlock({
    inlineStyles: [{ name: "highlight" }, { name: "small" }],
});
```

**Admin:**

```tsx
const TipTapRichTextBlock = createTipTapRichTextBlock({
    inlineStyles: [
        {
            name: "highlight",
            label: "Highlight",
            render: (props) => <span style={{ backgroundColor: "#fff3cd" }} {...props} />,
        },
        {
            name: "small",
            label: "Small",
            render: (props) => <span style={{ fontSize: 12 }} {...props} />,
        },
    ],
});
```

**Site:** Render the `inlineStyle` mark using `mark.attrs.type` to determine the style name:

```tsx
case "inlineStyle": {
    const type = mark.attrs?.type;
    // render based on type
}
```
