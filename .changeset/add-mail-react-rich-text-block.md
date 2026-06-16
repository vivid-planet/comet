---
"@comet/mail-react": minor
---

Add `createRichTextBlock` for rendering Comet CMS RichText block data in emails

The factory returns an `MjmlRichTextBlock` for the MJML context and an `HtmlRichTextBlock` for raw-HTML contexts (e.g. inside `MjmlRaw`), both driven by the same configuration. The `blockTypes` option maps the application's draft block types to theme text variants or plain style values; without it, every block renders with the base theme text styles. The `linkTypes` option adds href resolvers for the application's link block types on top of the built-in `external` support.

Call the factory once — at the top level of a file, not inside a component — and export the returned components:

```tsx
export const { MjmlRichTextBlock, HtmlRichTextBlock } = createRichTextBlock({
    blockTypes: {
        "header-one": { variant: "heading1" },
        "paragraph-standard": { variant: "body" },
    },
});
```

Usage sites pass only the block data:

```tsx
<MjmlRichTextBlock data={richTextData} />
```

Call the factory again for differently-configured blocks, renaming the destructured components — e.g. a headline-only block:

```tsx
export const { MjmlRichTextBlock: MjmlHeadlineRichTextBlock, HtmlRichTextBlock: HtmlHeadlineRichTextBlock } = createRichTextBlock({
    blockTypes: {
        "header-one": { variant: "heading1" },
        "header-two": { variant: "heading2" },
    },
});
```

External links render as `HtmlInlineLink`. Lists render flat as `<ul>` / `<ol>`.
