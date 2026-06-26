# pgMemento SQL sources

This prototype does **not** vendor the pgMemento PL/pgSQL sources (~10k lines). Install them once
into your database before running the API with the pgMemento action-logs module enabled.

## Install

Clone pgMemento and load its sources in the order defined by its installer:

```bash
git clone --branch master https://github.com/pgMemento/pgMemento.git
psql -d "$DATABASE_URL" -f pgMemento/INSTALL_PGMEMENTO.sql
```

`INSTALL_PGMEMENTO.sql` creates the `pgmemento` schema with the `transaction_log`,
`table_event_log` and `row_log` tables plus all server-side functions
(`create_table_audit`, `log_table_baseline`, …).

This is a one-time, DB-level step (comparable to enabling an extension). Per-table auditing is then
enabled automatically at API startup by `PgMementoSetupService` for every `@ActionLogs()` entity.

## Tested against

pgMemento `master` (schema v0.7.x): `op_id` mapping `INSERT=3`, `UPDATE=4`, `DELETE=7`, `TRUNCATE=8`,
audit-id column `pgmemento_audit_id`, acting user read from `transaction_log.session_info ->> 'client_user'`.
