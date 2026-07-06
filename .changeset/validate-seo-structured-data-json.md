---
"@comet/cms-admin": patch
---

Validate the SEO block's structured data field as JSON

The structured data field in the SEO block now shows a validation error when the entered value is not valid JSON. This matches the existing API-side `@IsJSON()` validation and prevents invalid payloads from being saved.
