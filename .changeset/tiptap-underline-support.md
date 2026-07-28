---
"@comet/cms-admin": minor
"@comet/cms-api": minor
"@comet/site-react": minor
"@comet/site-nextjs": minor
---

Add `underline` support to `createTipTapRichTextBlock`

The `underline` inline style is now part of the standard `supports` list and can be toggled via a new toolbar button. The underline mark is validated by the API, rendered as `<u>` by `renderTipTapRichText`, and the DraftJS migration maps the `UNDERLINE` inline style to it when supported. Per default it is disabled, pass a `supports` list with `underline` to enable it.
