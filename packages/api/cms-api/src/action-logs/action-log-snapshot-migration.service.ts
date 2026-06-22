import { type Configuration, MikroORM } from "@mikro-orm/core";
import type { AbstractSqlDriver } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import { type ActionLogSnapshot, type ActionLogSnapshotMigration, isActionLogSnapshotMigration } from "./action-log-snapshot-migration";

interface ExecutedSnapshotMigration {
    name: string;
    executedAt: Date;
    migration: ActionLogSnapshotMigration;
}

@Injectable()
export class ActionLogSnapshotMigrationService {
    private executedSnapshotMigrations?: Promise<ExecutedSnapshotMigration[]>;

    constructor(private readonly orm: MikroORM) {}

    async migrateSnapshot({
        snapshot,
        entityName,
        createdAt,
    }: {
        snapshot: ActionLogSnapshot;
        entityName: string;
        createdAt: Date;
    }): Promise<ActionLogSnapshot> {
        let migratedSnapshot = snapshot;
        for (const { executedAt, migration } of await this.getExecutedSnapshotMigrations()) {
            if (executedAt > createdAt) {
                migratedSnapshot = migration.migrateActionLogSnapshot({ snapshot: migratedSnapshot, entityName });
            }
        }
        return migratedSnapshot;
    }

    private getExecutedSnapshotMigrations(): Promise<ExecutedSnapshotMigration[]> {
        if (!this.executedSnapshotMigrations) {
            this.executedSnapshotMigrations = this.loadExecutedSnapshotMigrations();
        }
        return this.executedSnapshotMigrations;
    }

    private async loadExecutedSnapshotMigrations(): Promise<ExecutedSnapshotMigration[]> {
        const executedAtByName = new Map((await this.orm.getMigrator().getExecutedMigrations()).map((row) => [row.name, row.executed_at]));

        const driver = this.orm.em.getDriver() as AbstractSqlDriver;
        const config = this.orm.config as Configuration;
        const migrationsList = config.get("migrations").migrationsList ?? [];

        const snapshotMigrations: ExecutedSnapshotMigration[] = [];
        for (const entry of migrationsList) {
            const migrationClass = typeof entry === "function" ? entry : entry.class;
            const name = entry.name;

            // Only migrations that ran after a snapshot was created can require a migration of that snapshot. A
            // migration that hasn't been executed yet cannot have changed the schema the snapshot is based on.
            const executedAt = executedAtByName.get(name);
            if (!executedAt) {
                continue;
            }

            const migration = new migrationClass(driver, config);
            if (isActionLogSnapshotMigration(migration)) {
                snapshotMigrations.push({ name, executedAt, migration });
            }
        }

        // Migration names are timestamp-prefixed, so sorting by name yields the order in which they were applied.
        return snapshotMigrations.sort((a, b) => a.name.localeCompare(b.name));
    }
}
