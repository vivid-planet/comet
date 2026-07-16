---
"@comet/cms-api": patch
---

Stop `DependenciesService.refreshViews()` from flooding the database with advisory lock queries

Concurrent refreshes were deduplicated using PostgreSQL advisory locks (`pg_advisory_xact_lock`). Every caller kept a transaction open while blocked on the lock, which flooded the database when `refreshViews` was called from a field resolver (e.g. the DAM "Usages" column, which resolves once per row).

The same deduplication now happens via the `BlockIndexRefresh` tracking table: a caller atomically claims the refresh with a single conditional insert and skips immediately when a refresh is already running or was completed recently. The staleness-based refresh strategy (skip / concurrent / synchronous) is unchanged.
