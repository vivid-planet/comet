---
"@comet/mail-react": minor
---

Add `createRichTextBlockRenderer` for rendering Comet CMS RichText block data in emails

The factory binds one configuration to one `blockTextComponent` and returns a single block component. Pass the exported `MjmlBlockText` to render each draft block as `MjmlText` (within an `MjmlColumn`), or `HtmlBlockText` to render as `HtmlText` for raw-HTML contexts (e.g. inside `MjmlRaw`). The `blockTypes` option maps the application's draft block types to theme text variants or plain style values; without it, every block renders with the base theme text styles. The `linkTypes` option adds href resolvers for the application's link block types on top of the built-in `external` support.

Call the factory once per component — at the top level of a file, not inside a component — and export the returned components. To render the same configuration in both contexts, call it once with each `blockTextComponent`:

```tsx
import { createRichTextBlockRenderer, HtmlBlockText, MjmlBlockText } from "@comet/mail-react";

const blockTypes = {
    "header-one": { variant: "heading1" },
    "paragraph-standard": { variant: "body" },
};

export const MjmlRichTextBlock = createRichTextBlockRenderer({ blockTextComponent: MjmlBlockText, blockTypes });
export const HtmlRichTextBlock = createRichTextBlockRenderer({ blockTextComponent: HtmlBlockText, blockTypes });
```

Usage sites pass only the block data:

```tsx
<MjmlRichTextBlock data={richTextData} />
```

External links render as `HtmlInlineLink`. Lists render flat as `<ul>` / `<ol>`.
