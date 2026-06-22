import type { MikroORM } from "@mikro-orm/core";
import { Migration } from "@mikro-orm/migrations";
import { describe, expect, it } from "vitest";

import type { ActionLogSnapshot, ActionLogSnapshotMigration, MigrateActionLogSnapshotArgs } from "./action-log-snapshot-migration";
import { ActionLogSnapshotMigrationService } from "./action-log-snapshot-migration.service";

class RenameTitleToNameMigration extends Migration implements ActionLogSnapshotMigration {
    override up(): void {}

    migrateActionLogSnapshot({ snapshot, entityName }: MigrateActionLogSnapshotArgs): ActionLogSnapshot {
        if (entityName !== "Product" || !("title" in snapshot)) {
            return snapshot;
        }
        const { title, ...rest } = snapshot;
        return { ...rest, name: title };
    }
}

class AddVisibleMigration extends Migration implements ActionLogSnapshotMigration {
    override up(): void {}

    migrateActionLogSnapshot({ snapshot, entityName }: MigrateActionLogSnapshotArgs): ActionLogSnapshot {
        if (entityName !== "Product" || "visible" in snapshot) {
            return snapshot;
        }
        return { ...snapshot, visible: true };
    }
}

class SchemaOnlyMigration extends Migration {
    override up(): void {}
}

function createService({
    migrationsList,
    executedMigrations,
}: {
    migrationsList: Array<{ name: string; class: typeof Migration }>;
    executedMigrations: Array<{ name: string; executed_at: Date }>;
}): ActionLogSnapshotMigrationService {
    const orm = {
        em: { getDriver: () => ({}) },
        config: { get: () => ({ migrationsList }) },
        getMigrator: () => ({ getExecutedMigrations: async () => executedMigrations }),
    } as unknown as MikroORM;
    return new ActionLogSnapshotMigrationService(orm);
}

describe("ActionLogSnapshotMigrationService", () => {
    it("applies migrations executed after the snapshot was created", async () => {
        const service = createService({
            migrationsList: [
                { name: "Migration20240101000000", class: RenameTitleToNameMigration },
                { name: "Migration20240202000000", class: AddVisibleMigration },
            ],
            executedMigrations: [
                { name: "Migration20240101000000", executed_at: new Date("2024-01-01") },
                { name: "Migration20240202000000", executed_at: new Date("2024-02-02") },
            ],
        });

        const migrated = await service.migrateSnapshot({
            snapshot: { title: "Shirt" },
            entityName: "Product",
            createdAt: new Date("2023-12-31"),
        });

        expect(migrated).toEqual({ name: "Shirt", visible: true });
    });

    it("skips migrations that ran before the snapshot was created", async () => {
        const service = createService({
            migrationsList: [
                { name: "Migration20240101000000", class: RenameTitleToNameMigration },
                { name: "Migration20240202000000", class: AddVisibleMigration },
            ],
            executedMigrations: [
                { name: "Migration20240101000000", executed_at: new Date("2024-01-01") },
                { name: "Migration20240202000000", executed_at: new Date("2024-02-02") },
            ],
        });

        const migrated = await service.migrateSnapshot({
            snapshot: { name: "Shirt" },
            entityName: "Product",
            createdAt: new Date("2024-01-15"),
        });

        expect(migrated).toEqual({ name: "Shirt", visible: true });
    });

    it("ignores migrations without a snapshot migration and those not yet executed", async () => {
        const service = createService({
            migrationsList: [
                { name: "Migration20240101000000", class: SchemaOnlyMigration },
                { name: "Migration20240202000000", class: RenameTitleToNameMigration },
                { name: "Migration20240303000000", class: AddVisibleMigration },
            ],
            executedMigrations: [
                { name: "Migration20240101000000", executed_at: new Date("2024-01-01") },
                { name: "Migration20240202000000", executed_at: new Date("2024-02-02") },
            ],
        });

        const migrated = await service.migrateSnapshot({
            snapshot: { title: "Shirt" },
            entityName: "Product",
            createdAt: new Date("2023-12-31"),
        });

        expect(migrated).toEqual({ name: "Shirt" });
    });

    it("does not change snapshots of unrelated entities", async () => {
        const service = createService({
            migrationsList: [{ name: "Migration20240101000000", class: RenameTitleToNameMigration }],
            executedMigrations: [{ name: "Migration20240101000000", executed_at: new Date("2024-01-01") }],
        });

        const snapshot = { title: "Some news" };
        const migrated = await service.migrateSnapshot({
            snapshot,
            entityName: "News",
            createdAt: new Date("2023-12-31"),
        });

        expect(migrated).toEqual({ title: "Some news" });
    });
});
