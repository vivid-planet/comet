---
"@comet/cms-api": patch
---

Stop `DependenciesService.refreshViews()` from flooding the database with advisory lock queries

Concurrent refreshes were deduplicated using PostgreSQL advisory locks (`pg_advisory_xact_lock`). Every caller kept a transaction open while blocked on the lock, which flooded the database when `refreshViews` was called from a field resolver (e.g. the DAM "Usages" column, which resolves once per row).

Deduplication now happens lock-free on two levels:

- **One shared refresh per pod:** parallel `refreshViews()` calls in a process (e.g. one per DAM "Usages" row) share a single in-flight refresh, so only one claim and at most one poll loop runs per pod instead of one per call.
- **One refresh per database:** a partial unique index on the `BlockIndexRefresh` tracking table permits only one in-progress row, so across all pods exactly one caller wins the claim (`INSERT … ON CONFLICT DO NOTHING`) and runs a single `REFRESH MATERIALIZED VIEW`.

When a synchronous refresh is needed but another pod is already refreshing, the caller polls the tracking table until that refresh finishes (holding no database connection between polls) and then returns with fresh data, instead of starting a duplicate refresh or waiting on a lock. The staleness-based refresh strategy (skip / concurrent background / synchronous) is unchanged.
