import { type AnyEntity } from "@mikro-orm/postgresql";
import { type Type } from "@nestjs/common";

interface EntityInfoInterface {
    name: string;
    secondaryInformation?: string;
}

type GetEntityInfo<Entity extends AnyEntity = AnyEntity> = (item: Entity) => EntityInfoInterface | Promise<EntityInfoInterface>;
export interface EntityInfoServiceInterface<Entity extends AnyEntity = AnyEntity> {
    getEntityInfo: GetEntityInfo<Entity>;
}

export type EntityInfoGetter<Entity extends AnyEntity = AnyEntity> = GetEntityInfo<Entity> | Type<EntityInfoServiceInterface<Entity>>;

export function EntityInfo<Entity extends AnyEntity = AnyEntity>(entityInfoGetter: EntityInfoGetter<Entity>): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    return (target: Function) => {
        Reflect.defineMetadata(`data:entityInfo`, entityInfoGetter, target);
    };
}
