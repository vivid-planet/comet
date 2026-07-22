---
"@comet/cms-api": patch
---

Improve performance of the `block_index_dependencies` materialized view refresh

Resolve the `EntityInfo` of the root and target entity once over the union of all root blocks, instead of joining `EntityInfo` inside each root block's `SELECT`. Previously the `EntityInfo` view (a `UNION` over every entity, including a recursive DAM folder-path CTE) was re-evaluated once per root block, which dominated the refresh cost on large datasets. The refreshed view's columns and contents are unchanged.
