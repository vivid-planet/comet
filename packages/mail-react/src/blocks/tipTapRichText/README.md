# TipTapRichText block

Renders CMS TipTapRichText block data (Tip-Tap/ProseMirror JSON) in emails, as the Tip-Tap sibling of the [RichText block](../richText/README.md). Text block types (`paragraph`, `heading-1`…`heading-6`, `unordered-list`, `ordered-list`) and the application's `textBlockStyle` names are styled per `createTipTapRichTextBlock` call, matching the CMS TipTapRichTextBlock's own vocabulary. The walker is a hand-rolled recursive JSON traversal — no `@tiptap/*` dependency — mirroring the pattern already used by `@comet/site-react`'s `TipTapRichTextRenderer`.

Lists always render flat: nested lists are flattened into sibling `<li>`s of the top-level list, since Outlook breaks nested list padding/margin-left. Recommend `listLevelMax: 1` on the CMS block when it feeds this renderer.

## Non-goals

- No `cmsBlock` / `cmsInlineBlock` rendering. Child blocks embedded in the Tip-Tap document are skipped silently; app-specific embedded-block markup for email is out of scope for this experimental block.
- No placeholder substitution. `placeholder` nodes render their literal `{{name}}` text; the ESP or another downstream step performs the actual per-recipient substitution.
- No nested-list markup. Nested lists are flattened into the parent list's `<li>`s rather than rendered as nested `<ul>`/`<ol>`.
