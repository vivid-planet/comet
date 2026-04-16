---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Add `inlineStyles` option to `createTipTapRichTextBlock`

Similar to `blockStyles`, the new `inlineStyles` option allows configuring custom inline styles for the TipTap rich text editor. Inline styles are rendered as a select dropdown in the toolbar and applied as marks to the selected text.

**API:**

```ts
const TipTapRichTextBlock = createTipTapRichTextBlock({
    inlineStyles: [{ name: "highlight" }, { name: "tag" }],
});
```

**Admin:**

```tsx
const TipTapRichTextBlock = createTipTapRichTextBlock({
    inlineStyles: [
        { name: "highlight", label: <FormattedMessage id="highlight" defaultMessage="Highlight" /> },
        { name: "tag", label: <FormattedMessage id="tag" defaultMessage="Tag" /> },
    ],
});
```

**Site:**

The inline style mark is stored with `type: "inlineStyle"` and an `attrs.type` attribute containing the style name. Render it in the site accordingly.
