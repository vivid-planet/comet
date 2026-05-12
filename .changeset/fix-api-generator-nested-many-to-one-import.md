---
"@comet/api-generator": patch
---

Fix missing import for nested `ManyToOne` resolver target entities

`@comet/api-generator` now imports nested `ManyToOne` target entities in generated resolvers so generated code compiles without unresolved symbol errors.
