---
"@comet/site-nextjs": minor
"@comet/site-react": minor
"@comet/cms-api": minor
---

Support loading data for child blocks embedded in rich text content in `recursivelyLoadBlockData`

Child blocks embedded in a `createTipTapRichTextBlock` rich text block (stored as `cmsBlock`/`cmsInlineBlock` nodes) are now traversed by `recursivelyLoadBlockData`, so their registered block loaders run just like for any other nested block. This allows rich text child blocks to load additional data (e.g. via a GraphQL query) without relying on a `BlockTransformerService` on the API side.

To support this, the `tipTapContent` field of a `createTipTapRichTextBlock` block is now declared with a dedicated `TipTapRichTextBlock` block meta kind (instead of `Json`) that carries the configured child blocks. The block loader uses this kind to detect rich text content instead of inspecting arbitrary `Json` fields.

Also re-exported from `@comet/site-nextjs`.
