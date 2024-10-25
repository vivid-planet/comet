---
"@comet/blocks-admin": minor
"@comet/admin-rte": minor
"@comet/cms-admin": minor
"@comet/cms-api": minor
---

Add `extractTextContents` method to blocks and documents

`extractTextContents` can be used to extract plain text from blocks or documents. This functionality is particularly useful for operations such as search indexing or using the content for LLM-based tasks.

The method is optional for now, but it is recommended to implement it for all blocks and documents.
