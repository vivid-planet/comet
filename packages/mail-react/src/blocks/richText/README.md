# RichText block

Renders CMS RichText block data (draft-js raw content) in emails. Email templates need to style each draft block type — a `header-one` as a heading, a `paragraph-standard` as body text — and that mapping differs per application, so it is configured per `createRichTextBlock` call rather than shipped with the package.

## Non-goals

- No custom block or entity renderers. Block and link markup is controlled by the package; the factory configures only how block types are styled, how link types resolve to URLs, and how inline styles render.
