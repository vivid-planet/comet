---
"@comet/mail-react": minor
---

Add `createTipTapRichTextBlock`

Renders CMS `TipTapRichTextBlock` data (Tip-Tap/ProseMirror JSON) in emails — the Tip-Tap sibling of the existing `createRichTextBlock` (draft-js) factory. It returns a `MjmlTipTapRichTextBlock`/`HtmlTipTapRichTextBlock` pair, configured the same way: `blockTypes` and `textBlockStyles` map Tip-Tap text block types to theme styling, `linkTypes` resolves link marks to hrefs (with a built-in `external` resolver), `marks` styles Tip-Tap marks (with built-in `bold`/`italic`/`strike`/`superscript`/`subscript`), and `inlineStyles` renders the application's custom inline styles.

```tsx
export const { MjmlTipTapRichTextBlock, HtmlTipTapRichTextBlock } = createTipTapRichTextBlock({
    blockTypes: {
        "heading-1": { variant: "heading1" },
        paragraph: { variant: "body" },
    },
});
```

Lists render flat, as they already do for the draft-js block. `placeholder` nodes render their literal `{{name}}` text, and `cmsBlock`/`cmsInlineBlock` nodes are skipped — both are non-goals for this experimental block, documented in its `README.md`.
