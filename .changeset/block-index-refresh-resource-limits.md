---
"@comet/cms-api": minor
---

Add configurable resource limits for the `block_index_dependencies` refresh

The `block_index_dependencies` materialized view refresh can now apply a transaction-local `work_mem` and `statement_timeout`, so a pathological refresh degrades into a slow, disk-spilling query instead of exhausting the database server's memory. Both limits are opt-in via `DependenciesModule.register()` and only affect the refresh transaction:

```ts
DependenciesModule.register({
    blockIndexRefresh: {
        workMem: "64MB",
        statementTimeout: 30000, // milliseconds; 0 (default) disables the timeout
    },
});
```

`statementTimeout` defaults to `0` (disabled) and `workMem` is unset by default (the server-level setting is inherited), so the default behavior is unchanged. Importing `DependenciesModule` without calling `register()` keeps working.
