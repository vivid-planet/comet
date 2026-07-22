---
"@comet/cms-admin": minor
"@comet/cms-api": minor
"@comet/site-react": minor
"@comet/site-nextjs": minor
---

Add `underline` support to `createTipTapRichTextBlock`

The `underline` inline style is now part of the standard `supports` list (enabled by default, like `bold`, `italic`, and `strike`) and can be toggled via a new toolbar button. The underline mark is validated by the API, rendered as `<u>` by `renderTipTapRichText`, and the DraftJS migration maps the `UNDERLINE` inline style to it when supported. Pass a `supports` list without `underline` to disable it.
