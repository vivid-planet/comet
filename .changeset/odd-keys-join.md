---
"@comet/cms-admin": minor
---

Admin Generator: Add `virtual` prop to field-config to omit field value from mutation

Setting `virtual: true` generates to form-code to omit the value from gql-mutation input. A field used to filter asyncSelect can use this prop to prevent the generated code submitting the filter-value.
