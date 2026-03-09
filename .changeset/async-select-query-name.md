---
"@comet/admin-generator": patch
---

admin-generator asyncSelect: add optional `queryName` setting to override the generated GraphQL query name

Previously the query name was always derived from `rootQuery` (e.g. `"people"` → `"PeopleSelect"`). When multiple fields shared the same `rootQuery` this produced duplicate query names, causing errors in `gql:types`.

The new `queryName` option lets you set a distinct name for each field's query (e.g. `queryName: "HostSelect"` and `queryName: "GuestSelect"` for two fields that both use `rootQuery: "people"`). The default behavior (deriving the name from `rootQuery`) is unchanged.
