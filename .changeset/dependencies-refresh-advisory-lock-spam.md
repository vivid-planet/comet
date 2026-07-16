---
"@comet/cms-api": patch
---

Prevent `pg_advisory_xact_lock` query spam when refreshing block index dependencies

`DependenciesService.refreshViews()` is called once per resolved `dependents`/`dependencies` field, so a single view (e.g. the DAM "Usages" column) triggers many parallel refreshes in the same process. When the last completed refresh was older than 15 minutes (or none existed yet), every one of those calls took the blocking `pg_advisory_xact_lock` path and piled up waiting on the lock, each holding a database connection.

Parallel refreshes within a process are now deduplicated by sharing a single in-flight refresh, so at most one advisory lock is taken per instance while the cross-instance advisory lock still prevents concurrent `REFRESH MATERIALIZED VIEW` runs.
