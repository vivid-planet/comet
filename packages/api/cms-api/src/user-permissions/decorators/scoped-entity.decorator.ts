import type { AnyEntity } from "@mikro-orm/postgresql";
import { type CustomDecorator, SetMetadata, type Type } from "@nestjs/common";

import type { ContentScope } from "../../user-permissions/interfaces/content-scope.interface";

type EntityScopeFunction<Entity extends AnyEntity = AnyEntity> = (
    item: Entity,
) => ContentScope | ContentScope[] | Promise<ContentScope | ContentScope[]>;
export interface EntityScopeServiceInterface<Entity extends AnyEntity = AnyEntity> {
    getEntityScope: EntityScopeFunction<Entity>;
}

/**
 * SQL-resolvable scope mapping: keys are scope property names, values are dot-path field references
 * resolvable via `resolveFieldToSql`.
 * Example: `{ domain: "scope.domain", language: "scope.language" }`
 */
export type ScopedEntitySqlMapping = Record<string, string>;

export type ScopedEntityMeta<Entity extends AnyEntity = AnyEntity> =
    | EntityScopeFunction<Entity>
    | Type<EntityScopeServiceInterface<Entity>>
    | string
    | ScopedEntitySqlMapping;

export const SCOPED_ENTITY_METADATA_KEY = "scopedEntity";

/**
 * Checks if a ScopedEntityMeta value is SQL-resolvable (string path or object mapping).
 * SQL-resolvable variants can be used in SQL views (e.g., EntityInfoFullText).
 * Non-SQL-resolvable variants (functions/services) can only resolve scope at runtime.
 */
export function isScopedEntitySqlResolvable(meta: ScopedEntityMeta): meta is string | ScopedEntitySqlMapping {
    return typeof meta === "string" || (typeof meta === "object" && meta !== null);
}

export function ScopedEntity<Entity extends AnyEntity = AnyEntity>(value: ScopedEntityMeta<Entity>): CustomDecorator<string> {
    return SetMetadata<string, ScopedEntityMeta<Entity>>(SCOPED_ENTITY_METADATA_KEY, value);
}
