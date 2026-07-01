# RichText block

Renders CMS RichText block data (draft-js raw content) in emails. Email templates need to style each draft block type — a `header-one` as a heading, a `paragraph-standard` as body text — and that mapping differs per application, so it is configured per `createRichTextBlockRenderer` call rather than shipped with the package.

Each call binds one configuration to one `blockTextComponent` and returns a single block component. Pass `MjmlBlockText` for MJML context or `HtmlBlockText` for raw HTML — the same configuration is reused by calling the factory once per component rather than always creating both variants.

## Non-goals

- No custom block or entity renderers. The factory configures how block types are styled and how link types resolve to URLs — not the markup itself, which the package controls.
