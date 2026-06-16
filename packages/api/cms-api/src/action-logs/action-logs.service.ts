import { AnyEntity, EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import { SCOPED_ENTITY_METADATA_KEY, type ScopedEntityMeta } from "../user-permissions/decorators/scoped-entity.decorator";
import { getScopesForScopedEntity } from "../user-permissions/get-scopes-for-scoped-entity";
import type { ContentScope } from "../user-permissions/interfaces/content-scope.interface";

@Injectable()
export class ActionLogsService {
    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly entityManager: EntityManager,
    ) {}

    async getScopeFromEntity<T extends AnyEntity>(entity: T): Promise<ContentScope[] | undefined> {
        if ("scope" in entity) {
            return Array.isArray(entity.scope) ? entity.scope : [entity.scope];
        }

        if (!Reflect.hasOwnMetadata(SCOPED_ENTITY_METADATA_KEY, entity.constructor.prototype)) {
            return undefined;
        }

        const scoped: ScopedEntityMeta = Reflect.getMetadata(SCOPED_ENTITY_METADATA_KEY, entity.constructor.prototype);
        const scopedEntityScope = await getScopesForScopedEntity({
            scoped,
            entity: entity.constructor.name,
            row: entity,
            entityManager: this.entityManager,
            moduleRef: this.moduleRef,
        });
        return Array.isArray(scopedEntityScope) ? scopedEntityScope : [scopedEntityScope];
    }
}
