---
"@dextinity/mail-react": minor
---

Add `list` to the RichText block's `blockTypes`, so a custom block type renders as a list

Use it for a list in more than one text variant. A draft block has only one block type, so each variant needs a block type of its own.

**Example**

```tsx
export const { MjmlRichTextBlock, HtmlRichTextBlock } = createRichTextBlock({
    blockTypes: {
        "unordered-list-item": { variant: "copy" },
        "unordered-list-item-large": { variant: "copyLarge", list: "unordered" },
        "ordered-list-item-large": { variant: "copyLarge", list: "ordered" },
    },
});
```

For backward compatibility, `unordered-list-item` and `ordered-list-item` still render as lists without `list`.
