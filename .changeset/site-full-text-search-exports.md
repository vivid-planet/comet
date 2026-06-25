---
"@comet/cms-api": minor
---

Export `EntityInfoObject`, `EntityInfoFullTextObject` and `PaginatedEntityInfo`

This allows building custom full-text search resolvers (for example a public, permission-independent site search) that reuse the existing full-text search views and re-use the `entityInfo` relation to return name and secondary information.
