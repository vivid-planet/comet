---
"@comet/admin-generator": minor
---

admin-generator asyncSelect: query name is now derived from field name instead of rootQuery

Previously the GraphQL operation name was derived from `rootQuery` (e.g. `rootQuery: "people"` → `PeopleSelect`). When multiple fields shared the same `rootQuery`, this produced duplicate operation names, causing errors in `gql:types`.

The operation name is now derived from the **field name** (e.g. field `host` → `HostSelect`, field `guest` → `GuestSelect`). This ensures uniqueness across all fields in a form automatically, without any extra configuration.

**Breaking change:** Existing generated files will have different operation names after re-running the generator. Update any handwritten code that references the old query names.

An optional `queryName` setting was also added to both `asyncSelect` and `asyncSelectFilter` to manually override the generated operation name when needed.
