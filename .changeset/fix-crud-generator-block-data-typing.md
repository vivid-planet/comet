---
"@comet/api-generator": patch
---

Fix CRUD generator to handle ExtractBlockData type on block fields.

The generator now uses block factories directly (`BlockName.blockDataFactory(input.toPlain())`) instead of `input.transformToBlockData()`. This provides proper typing for entity fields using precise typing like `ExtractBlockData<typeof RichTextBlock>` without requiring any type assertions in the generated code.
