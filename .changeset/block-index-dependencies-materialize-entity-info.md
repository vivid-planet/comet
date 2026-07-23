---
"@comet/cms-api": patch
---

Materialize the `EntityInfo` snapshot used by the `block_index_dependencies` refresh

The `block_index_dependencies` refresh joins `EntityInfo` for the root and target entity. `EntityInfo` is a plain view (a `UNION` over every entity, including a recursive DAM folder-path CTE), so each refresh re-evaluated it from scratch. The refresh now joins a materialized, indexed snapshot of `EntityInfo` that is refreshed as part of the refresh, turning the joins into indexed lookups against a table scanned once. The live `EntityInfo` view is unchanged, so full-text search and warnings keep reading up-to-date data.
