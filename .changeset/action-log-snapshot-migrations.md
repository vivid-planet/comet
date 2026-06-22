---
"@comet/cms-api": minor
---

Add `snapshotMigrations` option to the `@ActionLogs()` decorator

Snapshots stored in `ActionLog` are frozen copies of an entity at a point in time. When an entity's schema changes (e.g. a renamed property or a changed enum value), older snapshots no longer match the current schema. `snapshotMigrations` lets you declare migrations that bring such snapshots up to the current schema. Migrations are applied lazily when a snapshot is read — the stored snapshots are not modified.

Each snapshot stores the number of migrations that were already reflected when it was created (`snapshotVersion`), so only the missing migrations are applied on read. Snapshots created before this feature existed run through all migrations.

**Example**

```ts
const migrateStatusToCamelCase: SnapshotMigration = (snapshot) => ({
    ...snapshot,
    status: snapshot.status === "Active" ? "active" : snapshot.status,
});

@Entity()
@ActionLogs({ snapshotMigrations: [migrateStatusToCamelCase] })
export class News extends BaseEntity {
    // ...
}
```

Append new migrations to the end of the array whenever the entity's schema changes in a way that affects the snapshot. The index of a migration in the array defines its version, so existing migrations must never be reordered or removed.
