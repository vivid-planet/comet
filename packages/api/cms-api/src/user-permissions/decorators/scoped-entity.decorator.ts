import { AnyEntity } from "@mikro-orm/core";
import { CustomDecorator, SetMetadata, Type } from "@nestjs/common";

import { ContentScope } from "../../user-permissions/interfaces/content-scope.interface";

export type EntityScopeFunction<Entity extends AnyEntity = AnyEntity> = (
    item: Entity,
) => ContentScope | ContentScope[] | Promise<ContentScope | ContentScope[]>;
export interface EntityScopeServiceInterface<Entity extends AnyEntity = AnyEntity> {
    getEntityScope: EntityScopeFunction<Entity>;
}

export type ScopedEntityMeta<Entity extends AnyEntity = AnyEntity> = EntityScopeFunction<Entity> | Type<EntityScopeServiceInterface<Entity>>;

export function ScopedEntity<Entity extends AnyEntity = AnyEntity>(value: ScopedEntityMeta<Entity>): CustomDecorator<string> {
    return SetMetadata<string, ScopedEntityMeta<Entity>>("scopedEntity", value);
}
