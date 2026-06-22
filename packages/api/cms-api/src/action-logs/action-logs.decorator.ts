export const ACTION_LOGS_METADATA_KEY = "actionLogs";

export type ActionLogSnapshot = Record<string, unknown>;

/**
 * Migrates a snapshot from the schema it was created with to the next schema version.
 *
 * Snapshots stored in `ActionLog` are frozen copies of an entity at a point in time.
 * When the entity's schema changes (e.g. a renamed property or a changed enum value),
 * older snapshots no longer match the current schema. A `SnapshotMigration` brings such
 * a snapshot one version forward. Migrations are applied lazily when a snapshot is read,
 * the stored snapshots are not modified.
 */
export type SnapshotMigration = (snapshot: ActionLogSnapshot) => ActionLogSnapshot;

export interface ActionLogsOptions {
    /**
     * Ordered list of migrations that are applied to a snapshot to bring it up to the current schema.
     *
     * Append new migrations to the end of the array whenever the entity's schema changes in a way
     * that affects the snapshot. The index of a migration in the array defines its version, so existing
     * migrations must never be reordered or removed.
     */
    snapshotMigrations?: SnapshotMigration[];
}

export interface ActionLogMetadata {
    snapshotMigrations: SnapshotMigration[];
}

export function ActionLogs({ snapshotMigrations = [] }: ActionLogsOptions = {}): ClassDecorator {
    return (entity) => {
        Reflect.defineMetadata(ACTION_LOGS_METADATA_KEY, { snapshotMigrations } satisfies ActionLogMetadata, entity.prototype);
    };
}
