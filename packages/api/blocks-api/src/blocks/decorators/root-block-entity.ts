import { Type } from "@nestjs/common";

// Copied from @mikro-orm/core since we don't have a dependency on it in @comet/blocks-api.
// TODO Remove type once we merge @comet/cms-api and @comet/blocks-api.
// https://github.com/mikro-orm/mikro-orm/blob/master/packages/core/src/typings.ts#L237
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEntity<T = any> = Partial<T>;

export type GetEntityVisibility<Entity extends AnyEntity = AnyEntity> = (item: Entity) => boolean | Promise<boolean>;
export interface EntityVisibilityServiceInterface<Entity extends AnyEntity = AnyEntity> {
    getEntityVisibility: GetEntityVisibility<Entity>;
}

export type EntityVisibilityGetter<Entity extends AnyEntity = AnyEntity> =
    | GetEntityVisibility<Entity>
    | Type<EntityVisibilityServiceInterface<Entity>>;

export interface RootBlockEntityOptions<Entity extends AnyEntity = AnyEntity> {
    isVisible?: EntityVisibilityGetter<Entity>;
}
export function RootBlockEntity<Entity extends AnyEntity = AnyEntity>(options: RootBlockEntityOptions<Entity> = {}): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Function) {
        Reflect.defineMetadata(`data:rootBlockEntityOptions`, options, target);
    };
}
