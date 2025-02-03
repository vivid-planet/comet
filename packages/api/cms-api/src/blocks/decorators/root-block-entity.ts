import { type AnyEntity } from "@mikro-orm/postgresql";

export interface RootBlockEntityOptions<Entity extends AnyEntity = AnyEntity> {
    isVisible?: (entity: Entity) => boolean;
}
export function RootBlockEntity<Entity extends AnyEntity = AnyEntity>(options: RootBlockEntityOptions<Entity> = {}): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    return function (target: Function) {
        Reflect.defineMetadata(`data:rootBlockEntityOptions`, options, target);
    };
}
