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
 * SQL-convertible scope path definition.
 *
 * - String form: a dot-path to an embedded scope object (e.g. `"company.scope"`)
 * - Object form: a mapping of scope field names to dot-paths (e.g. `{ companyId: "company.id" }`)
 */
export type ScopedEntitySqlPath = string | Record<string, string>;

export type ScopedEntityMeta<Entity extends AnyEntity = AnyEntity> =
    | EntityScopeFunction<Entity>
    | Type<EntityScopeServiceInterface<Entity>>
    | ScopedEntitySqlPath;

export const SCOPED_ENTITY_METADATA_KEY = "scopedEntity";

export function isScopedEntitySqlPath(value: ScopedEntityMeta): value is ScopedEntitySqlPath {
    return typeof value === "string" || (typeof value === "object" && !("getEntityScope" in value) && !("prototype" in value));
}

export function ScopedEntity<Entity extends AnyEntity = AnyEntity>(value: ScopedEntityMeta<Entity>): CustomDecorator<string> {
    return SetMetadata<string, ScopedEntityMeta<Entity>>(SCOPED_ENTITY_METADATA_KEY, value);
}
