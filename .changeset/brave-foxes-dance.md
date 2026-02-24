---
"@comet/cms-api": minor
---

Deduplicate block index refreshes using PostgreSQL advisory locks

Replace the race-condition-prone `pg_stat_activity` check in `DependenciesService.refreshViews()` with `pg_try_advisory_xact_lock`, ensuring only one refresh runs at a time. This fixes the issue where many parallel requests (e.g., from the DAM Usages column) could trigger multiple concurrent `REFRESH MATERIALIZED VIEW` operations, overloading the database.
