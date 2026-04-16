---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Add `inlineStyles` option to `createTipTapRichTextBlock`

Similar to `blockStyles`, the new `inlineStyles` option allows configuring custom inline styles for the TipTap rich text editor. Inline styles are rendered as a select dropdown in the toolbar and applied as marks to the selected text.

Inline styles support an optional `appliesTo` property to restrict them to specific block types (e.g., only paragraphs or only certain heading levels), matching the behavior of `blockStyles.appliesTo`. The API validates that inline style marks respect their `appliesTo` constraints.

**API:**

```ts
const TipTapRichTextBlock = createTipTapRichTextBlock({
    inlineStyles: [
        { name: "highlight" },
        { name: "tag", appliesTo: ["paragraph"] },
    ],
});
```

**Admin:**

```tsx
const TipTapRichTextBlock = createTipTapRichTextBlock({
    inlineStyles: [
        { name: "highlight", label: <FormattedMessage id="highlight" defaultMessage="Highlight" /> },
        { name: "tag", label: <FormattedMessage id="tag" defaultMessage="Tag" />, appliesTo: ["paragraph"] },
    ],
});
```

**Site:**

The inline style mark is stored with `type: "inlineStyle"` and an `attrs.type` attribute containing the style name. Render it in the site accordingly.
