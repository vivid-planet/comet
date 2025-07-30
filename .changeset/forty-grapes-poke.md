---
"@comet/api-generator": minor
---

Always generate GraphQL input

Generate the input even if `create` and `update` are both set to `false`.
The input is still useful for other operations, e.g., a custom create mutation.
