import { type AnyEntity } from "@mikro-orm/postgresql";

import { isInjectableService } from "../../common/helper/is-injectable-service.helper";
import {
    type EntityScopeServiceInterface,
    isScopedEntityCallbackOrService,
    isScopedEntityRelationPath,
    isScopedEntitySqlMapping,
    type ScopedEntityMeta,
} from "../../user-permissions/decorators/scoped-entity.decorator";
import { type ContentScope } from "../../user-permissions/interfaces/content-scope.interface";

/**
 * Resolves a dot-separated field path on an entity instance, loading MikroORM references as needed.
 * Example: resolveEntityFieldPath(newsComment, "news.scope") -> news.scope value
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function resolveEntityFieldPath(entity: any, fieldPath: string): Promise<unknown> {
    const parts = fieldPath.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = entity;

    for (const part of parts) {
        if (current === null || current === undefined) {
            throw new Error(`Cannot resolve field path "${fieldPath}": encountered null/undefined`);
        }

        // Handle MikroORM Reference (Ref<T>) - check for load/unwrap method
        if (typeof current.unwrap === "function") {
            current = current.unwrap();
        }

        const value = current[part];

        if (value === null || value === undefined) {
            return value;
        }

        // If the value is a MikroORM Reference, load/unwrap it
        if (typeof value.load === "function") {
            current = await value.load();
        } else if (typeof value.init === "function") {
            // MikroORM Collection - should not happen for scope resolution
            current = await value.init();
        } else {
            current = value;
        }
    }

    return current;
}

/**
 * Resolves the scope from a ScopedEntity metadata value and a loaded entity instance.
 * Handles all ScopedEntity formats: callback, service, SQL mapping, and relation path.
 */
export async function resolveEntityScope(
    scopedMeta: ScopedEntityMeta,
    entity: AnyEntity,
    getService: <T>(type: new (...args: unknown[]) => T) => T,
): Promise<ContentScope | ContentScope[]> {
    if (isScopedEntitySqlMapping(scopedMeta)) {
        // Record mapping: { scopeKey: "field.path" }
        const scope: Record<string, unknown> = {};
        for (const [scopeKey, fieldPath] of Object.entries(scopedMeta)) {
            scope[scopeKey] = await resolveEntityFieldPath(entity, fieldPath);
        }
        return scope as ContentScope;
    }

    if (isScopedEntityRelationPath(scopedMeta)) {
        // String relation path: "relation.scope"
        const result = await resolveEntityFieldPath(entity, scopedMeta);
        if (!result) {
            throw new Error(`@ScopedEntity relation path "${scopedMeta}" resolved to null/undefined`);
        }
        return result as ContentScope;
    }

    if (isScopedEntityCallbackOrService(scopedMeta)) {
        if (isInjectableService<EntityScopeServiceInterface>(scopedMeta)) {
            const service = getService<EntityScopeServiceInterface>(scopedMeta);
            return service.getEntityScope(entity);
        } else {
            return scopedMeta(entity);
        }
    }

    throw new Error("Unknown @ScopedEntity metadata format");
}
