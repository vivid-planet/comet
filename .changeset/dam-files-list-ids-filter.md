---
"@comet/cms-api": minor
---

Add `ids` filter to `damFilesList`

`FileFilterInput` now accepts an optional `ids: [ID!]` to restrict the result set to specific files. Useful for batch-loading a known selection (e.g. after a multi-file picker confirms) in a single request.
