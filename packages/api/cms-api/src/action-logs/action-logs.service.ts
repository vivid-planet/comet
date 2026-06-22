import { type AnyEntity, EntityManager, type EntityName } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import { SCOPED_ENTITY_METADATA_KEY, type ScopedEntityMeta } from "../user-permissions/decorators/scoped-entity.decorator";
import { getScopesForScopedEntity } from "../user-permissions/get-scopes-for-scoped-entity";
import type { ContentScope } from "../user-permissions/interfaces/content-scope.interface";
import { ACTION_LOGS_METADATA_KEY, type ActionLogMetadata, type ActionLogSnapshot } from "./action-logs.decorator";
import { applySnapshotMigrations } from "./apply-snapshot-migrations";
import type { ActionLog } from "./entities/action-log.entity";

@Injectable()
export class ActionLogsService {
    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly entityManager: EntityManager,
    ) {}

    /**
     * Applies the migrations declared on the entity (via `@ActionLogs`) to bring an old snapshot up to the current schema.
     *
     * The snapshot's `snapshotVersion` (the number of migrations already reflected when it was stored) determines where to
     * start. Snapshots created before snapshot migrations existed have no `snapshotVersion` and run through all migrations.
     * Migrations are applied lazily on read — the stored snapshot is never modified.
     */
    migrateSnapshot(actionLog: ActionLog): ActionLogSnapshot | undefined {
        if (actionLog.snapshot == null) {
            return actionLog.snapshot;
        }

        const entityMetadata = this.entityManager.getMetadata().get(actionLog.entityName);
        const actionLogsMetadata: ActionLogMetadata | undefined = Reflect.getMetadata(ACTION_LOGS_METADATA_KEY, entityMetadata.class.prototype);
        const migrations = actionLogsMetadata?.snapshotMigrations ?? [];

        return applySnapshotMigrations({ snapshot: actionLog.snapshot, snapshotVersion: actionLog.snapshotVersion, migrations });
    }

    async getScopeFromEntity<T extends AnyEntity>(entity: T): Promise<ContentScope[] | undefined> {
        if ("scope" in entity) {
            return Array.isArray(entity.scope) ? entity.scope : [entity.scope];
        }
        if (Reflect.hasOwnMetadata(SCOPED_ENTITY_METADATA_KEY, entity.constructor.prototype)) {
            const scoped: ScopedEntityMeta = Reflect.getMetadata(SCOPED_ENTITY_METADATA_KEY, entity.constructor.prototype);
            const scopedEntityScope = await getScopesForScopedEntity({
                scoped,
                entity: entity.constructor as EntityName<AnyEntity>,
                row: entity,
                entityManager: this.entityManager,
                moduleRef: this.moduleRef,
            });
            return Array.isArray(scopedEntityScope) ? scopedEntityScope : [scopedEntityScope];
        }
        return undefined;
    }
}
