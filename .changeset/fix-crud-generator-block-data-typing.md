---
"@comet/api-generator": patch
---

Fix CRUD generator to handle precise block data types without casting

The generator now uses block factories directly (`BlockName.blockDataFactory(input.toPlain())`) instead of casting `transformToBlockData()` calls. This provides proper type safety for entity fields using precise typing like `ExtractBlockData<typeof RichTextBlock>` without requiring any type assertions in the generated code.
