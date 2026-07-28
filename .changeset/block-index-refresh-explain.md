---
"@comet/cms-api": minor
---

Add a diagnosis mode for the `block_index_dependencies` refresh

`refreshBlockIndexViews --explain` analyzes the `block_index_dependencies` refresh instead of running it. Because PostgreSQL does not support `EXPLAIN` on `REFRESH MATERIALIZED VIEW`, it runs `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)` on the view's defining query (which carries the dominant cost, the `EntityInfo` joins) and reports run time, shared/temp buffer usage, on-disk sorts, the number of `EntityInfo` references in the generated SQL, and the number of `EntityInfo` scan nodes in the plan. Add `--json` for machine-readable output:

```sh
# human-readable summary
$ <cli> refreshBlockIndexViews --explain

# JSON, e.g. for regression checks
$ <cli> refreshBlockIndexViews --explain --json
```

The building blocks are also exported for programmatic use: `DependenciesService.explainBlockIndexDependenciesRefresh()`, `DependenciesService.buildBlockIndexDependenciesViewSelectSql()`, and the `summarizeBlockIndexDependenciesExplain` helper.
