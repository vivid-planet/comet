---
"@comet/cms-admin": minor
---

Admin Generator: Add filter support for asyncSelect

Setting `filterField` for asyncSelect-field will change the generated code to add the value of the referenced field (by name) to filter-var of the graphql-query.
