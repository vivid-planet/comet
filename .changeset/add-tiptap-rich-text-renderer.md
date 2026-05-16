---
"@comet/site-react": minor
"@comet/site-nextjs": minor
---

Add `renderTipTapRichText` for rendering TipTap rich text content

Renders TipTap (ProseMirror) JSON content to React without pulling in any of TipTap's editor runtime. Pass per-node and per-mark handlers to control the output:

```tsx
import {
    defaultTipTapMarkMapping,
    defaultTipTapNodeMapping,
    hasTipTapRichTextContent,
    renderTipTapRichText,
    type TipTapNode,
} from "@comet/site-nextjs";

const content = data.tipTapContent as TipTapNode;

return renderTipTapRichText({
    content,
    nodeMapping: {
        ...defaultTipTapNodeMapping,
        paragraph: ({ children }) => <p className="paragraph">{children}</p>,
    },
    markMapping: {
        ...defaultTipTapMarkMapping,
        link: ({ mark, children }) => <a href={(mark.attrs?.href as string) ?? "#"}>{children}</a>,
    },
});
```

`defaultTipTapNodeMapping` covers `paragraph`, `heading`, `bulletList`, `orderedList`, `listItem`, `hardBreak`, `nonBreakingSpace`, and `softHyphen`. `defaultTipTapMarkMapping` covers `bold`, `italic`, `strike`, `superscript`, and `subscript`. Apps typically spread the defaults and override only the handlers that need site-specific components (e.g. the `link` mark).
