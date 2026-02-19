import { type AnyEntity } from "@mikro-orm/postgresql";
import { type CustomDecorator, SetMetadata, type Type } from "@nestjs/common";

import { type ContentScope } from "../../user-permissions/interfaces/content-scope.interface";

type EntityScopeFunction<Entity extends AnyEntity = AnyEntity> = (
    item: Entity,
) => ContentScope | ContentScope[] | Promise<ContentScope | ContentScope[]>;
export interface EntityScopeServiceInterface<Entity extends AnyEntity = AnyEntity> {
    getEntityScope: EntityScopeFunction<Entity>;
}

export type ScopedEntityMeta<Entity extends AnyEntity = AnyEntity> = EntityScopeFunction<Entity> | Type<EntityScopeServiceInterface<Entity>>;

export const SCOPED_ENTITY_METADATA_KEY = "scopedEntity";

export function ScopedEntity<Entity extends AnyEntity = AnyEntity>(value: ScopedEntityMeta<Entity>): CustomDecorator<string> {
    return SetMetadata<string, ScopedEntityMeta<Entity>>(SCOPED_ENTITY_METADATA_KEY, value);
}
