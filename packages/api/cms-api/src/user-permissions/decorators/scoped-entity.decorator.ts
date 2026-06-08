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
 * Declarative, SQL-convertible description of an entity's scope.
 *
 * In contrast to the callback and service variants, this can be both resolved to a SQL expression (required by the
 * `FullTextSearchModule`, which builds the scope from the database) and evaluated at runtime (e.g. in the auth guard).
 *
 * - A string is a field path pointing to the scope object, e.g. `"company.scope"`.
 * - An object maps scope properties to field paths, e.g. `{ companyId: "company.id" }`.
 */
export type EntityScopeMapping = string | Record<string, string>;

export type ScopedEntityMeta<Entity extends AnyEntity = AnyEntity> =
    | EntityScopeFunction<Entity>
    | Type<EntityScopeServiceInterface<Entity>>
    | EntityScopeMapping;

export const SCOPED_ENTITY_METADATA_KEY = "scopedEntity";

export function ScopedEntity<Entity extends AnyEntity = AnyEntity>(value: ScopedEntityMeta<Entity>): CustomDecorator<string> {
    return SetMetadata<string, ScopedEntityMeta<Entity>>(SCOPED_ENTITY_METADATA_KEY, value);
}

export function isEntityScopeMapping(value: ScopedEntityMeta): value is EntityScopeMapping {
    return typeof value === "string" || (typeof value === "object" && value !== null);
}
