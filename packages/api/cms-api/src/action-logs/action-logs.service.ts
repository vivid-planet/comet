import { type AnyEntity, EntityManager, type EntityName } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import { SCOPED_ENTITY_METADATA_KEY, type ScopedEntityMeta } from "../user-permissions/decorators/scoped-entity.decorator";
import { getScopesForScopedEntity } from "../user-permissions/get-scopes-for-scoped-entity";
import type { ContentScope } from "../user-permissions/interfaces/content-scope.interface";
import { ActionLog } from "./entities/action-log.entity";

@Injectable()
export class ActionLogsService {
    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly entityManager: EntityManager,
    ) {}

    /**
     * Restores the entity referenced by the action log to the state stored in its snapshot.
     * Updates the existing entity or re-creates it if it has been deleted in the meantime.
     */
    async restoreSnapshot(actionLog: ActionLog): Promise<AnyEntity> {
        if (actionLog.snapshot == null) {
            throw new Error(`Action log ${actionLog.id} has no snapshot to restore (the entity was deleted).`);
        }

        const metadata = this.entityManager.getMetadata().get(actionLog.entityName);
        const entity = await this.entityManager.findOne(metadata.class, actionLog.entityId);

        if (entity) {
            this.entityManager.assign(entity, actionLog.snapshot);
            await this.entityManager.flush();
            return entity;
        }

        const restoredEntity = this.entityManager.create(metadata.class, actionLog.snapshot);
        await this.entityManager.persistAndFlush(restoredEntity);
        return restoredEntity;
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
