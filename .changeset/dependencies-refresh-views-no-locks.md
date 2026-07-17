---
"@comet/cms-api": patch
---

Stop `DependenciesService.refreshViews()` from flooding the database with advisory lock queries

Concurrent refreshes were deduplicated using PostgreSQL advisory locks (`pg_advisory_xact_lock`). Every caller kept a transaction open while blocked on the lock, which flooded the database when `refreshViews` was called from a field resolver (e.g. the DAM "Usages" column, which resolves once per row).

The same deduplication now happens lock-free via the `BlockIndexRefresh` tracking table: a caller claims the refresh with a conditional insert of an in-progress row (made atomic across pods as described below). When a synchronous refresh is needed but another caller is already refreshing, the caller polls the tracking table until that refresh finishes (holding no database connection between polls) and then returns with fresh data, instead of starting a duplicate refresh or waiting on a lock. The staleness-based refresh strategy (skip / concurrent background / synchronous) is unchanged.

A `REFRESH MATERIALIZED VIEW` is expensive and can take many seconds, so no more than one must run at a time. This is now guaranteed on two levels:

- **One shared refresh per pod:** parallel `refreshViews()` calls in a process (e.g. one per DAM "Usages" row) share a single in-flight refresh, so only one claim and at most one poll loop runs per pod instead of one per call.
- **One refresh per database:** a partial unique index on the `BlockIndexRefresh` table permits only one in-progress row, making the claim atomic across pods (`INSERT … ON CONFLICT DO NOTHING`). Without it, callers arriving simultaneously could all pass the conditional insert's `WHERE NOT EXISTS` check before any insert was visible and each start its own refresh.
