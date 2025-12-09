import { AnyEntity } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import { isInjectableService } from "../common/helper/is-injectable-service.helper";
import { SCOPED_ENTITY_METADATA_KEY, type ScopedEntityMeta } from "../user-permissions/decorators/scoped-entity.decorator";
import type { ContentScope } from "../user-permissions/interfaces/content-scope.interface";

@Injectable()
export class ActionLogsService {
    constructor(private readonly moduleRef: ModuleRef) {}

    async getScopeFromEntity<T extends AnyEntity>(entity: T): Promise<ContentScope[] | undefined> {
        let scope: ContentScope[] | undefined;
        if ("scope" in entity) {
            scope = Array.isArray(entity.scope) ? entity.scope : [entity.scope];
        } else if (Reflect.hasOwnMetadata(SCOPED_ENTITY_METADATA_KEY, entity.constructor.prototype)) {
            const scopedEntityMetadata: ScopedEntityMeta = Reflect.getMetadata(SCOPED_ENTITY_METADATA_KEY, entity.constructor.prototype);
            let scopedEntityScope: ContentScope | ContentScope[];
            if (isInjectableService(scopedEntityMetadata)) {
                const service = this.moduleRef.get(scopedEntityMetadata, { strict: false });
                scopedEntityScope = await service.getEntityScope(entity);
            } else {
                scopedEntityScope = await scopedEntityMetadata(entity.constructor);
            }
            scope = Array.isArray(scopedEntityScope) ? scopedEntityScope : [scopedEntityScope];
        }
        return scope;
    }
}
