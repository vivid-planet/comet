export type ActionLogSnapshot = Record<string, unknown>;

export interface MigrateActionLogSnapshotArgs {
    snapshot: ActionLogSnapshot;
    entityName: string;
}

/**
 * Implemented by MikroORM migration classes that need to keep `ActionLog` snapshots in sync with a schema change.
 *
 * Snapshots are stored as JSON at the time of an action and are never touched by the SQL migration that alters the
 * actual table. When such a snapshot is read back, every migration executed after the snapshot was created and that
 * implements this interface is applied in order, bringing the snapshot up to the current schema.
 *
 * @example
 * export class Migration20260622120000 extends Migration implements ActionLogSnapshotMigration {
 *     override async up(): Promise<void> {
 *         this.addSql(`alter table "Product" rename column "title" to "name";`);
 *     }
 *
 *     migrateActionLogSnapshot({ snapshot, entityName }: MigrateActionLogSnapshotArgs): ActionLogSnapshot {
 *         if (entityName !== "Product" || !("title" in snapshot)) {
 *             return snapshot;
 *         }
 *         const { title, ...rest } = snapshot;
 *         return { ...rest, name: title };
 *     }
 * }
 */
export interface ActionLogSnapshotMigration {
    migrateActionLogSnapshot(args: MigrateActionLogSnapshotArgs): ActionLogSnapshot;
}

export function isActionLogSnapshotMigration(migration: object): migration is ActionLogSnapshotMigration {
    return typeof (migration as Partial<ActionLogSnapshotMigration>).migrateActionLogSnapshot === "function";
}
