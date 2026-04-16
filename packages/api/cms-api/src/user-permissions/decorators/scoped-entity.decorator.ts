import { type AnyEntity } from "@mikro-orm/postgresql";
import { type CustomDecorator, SetMetadata, type Type } from "@nestjs/common";

import { isInjectableService } from "../../common/helper/is-injectable-service.helper";
import { type ContentScope } from "../../user-permissions/interfaces/content-scope.interface";

type EntityScopeFunction<Entity extends AnyEntity = AnyEntity> = (
    item: Entity,
) => ContentScope | ContentScope[] | Promise<ContentScope | ContentScope[]>;
export interface EntityScopeServiceInterface<Entity extends AnyEntity = AnyEntity> {
    getEntityScope: EntityScopeFunction<Entity>;
}

/**
 * SQL-mappable scope definition: maps scope property names to entity field paths.
 * Example: `{ domain: "company.scope.domain", language: "company.scope.language" }`
 */
export type ScopedEntitySqlMapping = Record<string, string>;

export type ScopedEntityMeta<Entity extends AnyEntity = AnyEntity> =
    | EntityScopeFunction<Entity>
    | Type<EntityScopeServiceInterface<Entity>>
    | ScopedEntitySqlMapping
    | string;

/**
 * Checks if the ScopedEntity metadata is a SQL-mappable record mapping.
 * Example: `@ScopedEntity({ domain: "company.scope.domain" })`
 */
export function isScopedEntitySqlMapping(meta: ScopedEntityMeta): meta is ScopedEntitySqlMapping {
    return typeof meta === "object" && meta !== null && !isInjectableService(meta);
}

/**
 * Checks if the ScopedEntity metadata is a string relation path.
 * Example: `@ScopedEntity("company.scope")`
 */
export function isScopedEntityRelationPath(meta: ScopedEntityMeta): meta is string {
    return typeof meta === "string";
}

/**
 * Checks if the ScopedEntity metadata is a callback function or injectable service (not SQL-convertible).
 */
export function isScopedEntityCallbackOrService(meta: ScopedEntityMeta): meta is EntityScopeFunction | Type<EntityScopeServiceInterface> {
    return typeof meta === "function";
}

export const SCOPED_ENTITY_METADATA_KEY = "scopedEntity";

export function ScopedEntity<Entity extends AnyEntity = AnyEntity>(value: ScopedEntityMeta<Entity>): CustomDecorator<string> {
    return SetMetadata<string, ScopedEntityMeta<Entity>>(SCOPED_ENTITY_METADATA_KEY, value);
}
