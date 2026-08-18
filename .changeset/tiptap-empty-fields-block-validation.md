---
"@dextinity/cms-api": patch
---

Fix validation error when saving a `createTipTapRichTextBlock` link or child block that has no fields

A link type or child block without any fields (and therefore without any validation decorators) was rejected as an "unknown value" by `class-validator`'s `forbidUnknownValues` (the default since v0.14). This made it impossible to save rich text content containing such a block. The block's data is now validated with `forbidUnknownValues` disabled, while `whitelist` and `forbidNonWhitelisted` continue to reject unexpected properties.
