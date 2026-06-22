---
"@comet/cms-api": minor
---

Add live migration of `ActionLog` snapshots

`ActionLog` snapshots are stored as JSON at the time of an action and are never touched by the SQL migration that later alters the underlying table. As a result, old snapshots keep their outdated shape forever, which becomes a problem once an entity's schema changes.

MikroORM migration classes can now implement the `ActionLogSnapshotMigration` interface to define how a snapshot is transformed for a given schema change, right next to the migration that performs it. When a snapshot is read, every migration executed after the snapshot was created is applied in order, bringing the snapshot up to the current schema.

**Example**

```ts
export class Migration20260622120000 extends Migration implements ActionLogSnapshotMigration {
    override async up(): Promise<void> {
        this.addSql(`alter table "Product" rename column "title" to "name";`);
    }

    migrateActionLogSnapshot({ snapshot, entityName }: MigrateActionLogSnapshotArgs): ActionLogSnapshot {
        if (entityName !== "Product" || !("title" in snapshot)) {
            return snapshot;
        }
        const { title, ...rest } = snapshot;
        return { ...rest, name: title };
    }
}
```
