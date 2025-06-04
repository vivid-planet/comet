---
"@comet/cms-admin": patch
---

Set `altText` and `title` fields to null in the DAM when deleting the field value

Previously, the `altText` and `title` fields value couldn't be completely removed.
