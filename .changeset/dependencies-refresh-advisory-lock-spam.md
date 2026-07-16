---
"@comet/cms-api": patch
---

Prevent `pg_advisory_xact_lock` query spam when refreshing block index dependencies

`DependenciesService.refreshViews()` runs once per resolved `dependents`/`dependencies` field, so a single view (e.g. the DAM "Usages" column) triggers many parallel refreshes. When the last refresh was older than 15 minutes (or none existed), each took the blocking lock path and piled up waiting, holding a database connection.

Parallel refreshes within a process are now deduplicated into a single in-flight refresh, so at most one advisory lock is taken per instance, while the cross-instance advisory lock still prevents concurrent `REFRESH MATERIALIZED VIEW` runs.
