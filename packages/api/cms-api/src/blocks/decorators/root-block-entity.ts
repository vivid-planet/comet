import { AnyEntity } from "@mikro-orm/postgresql";

export interface RootBlockEntityOptions<Entity extends AnyEntity = AnyEntity> {
    isVisible?: (entity: Entity) => boolean;
}
export function RootBlockEntity<Entity extends AnyEntity = AnyEntity>(options: RootBlockEntityOptions<Entity> = {}): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Function) {
        Reflect.defineMetadata(`data:rootBlockEntityOptions`, options, target);
    };
}
