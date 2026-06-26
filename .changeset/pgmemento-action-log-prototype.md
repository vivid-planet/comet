---
"@comet/cms-api": minor
---

Add experimental `PgMementoActionLogsModule` (prototype)

Prototype that replaces the node-side action-log implementation with [pgMemento](https://github.com/pgMemento/pgMemento), a trigger-based PostgreSQL audit trail. Logging moves into the database (every committed change is captured, not only ORM writes), while the node side only records the acting user via `pgmemento.session_info`. The GraphQL `ActionLog` type is reconstructed on read, so the Admin UI stays unchanged.

`PgMementoActionLogsModule` mirrors the `ActionLogsModule` API (`forRoot` / `forFeature`). It is experimental and opt-in — see `src/action-logs-pgmemento/README.md` for setup and known limitations.
