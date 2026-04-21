---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Add `listLevelMax` option to `createTipTapRichTextBlock` that limits the maximum number of nested list levels

The option is available on both the API and admin side. On the admin side, the indent button is disabled when the maximum nesting depth is reached. On the API side, content exceeding the maximum nesting depth is rejected during validation.
