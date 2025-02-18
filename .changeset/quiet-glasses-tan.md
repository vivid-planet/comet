---
"@comet/blocks-admin": minor
"@comet/admin-rte": minor
"@comet/cms-admin": minor
"@comet/cms-api": minor
---

Add `extractTextContents` method to blocks

`extractTextContents` can be used to extract plain text from blocks. This functionality is particularly useful for operations such as search indexing or using the content for LLM-based tasks. The option `includeInvisibleContent` can be set to include the content of invisible blocks in the extracted text.

The method is optional for now, but it is recommended to implement it for all blocks and documents. The default behavior is to return

-   if the state is a string: the string itself
-   otherwise: an empty array
