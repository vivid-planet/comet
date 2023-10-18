import { AnyEntity } from "@mikro-orm/core";
import { ModuleRef } from "@nestjs/core";

export type GetDependencyInfo<Entity extends AnyEntity> = (
    item: Entity,
    moduleRef: ModuleRef,
) => Promise<{ name: string; secondaryInformation?: string }>;

export function DependencyInfo<Entity extends AnyEntity>(getDependencyInfo: GetDependencyInfo<Entity>): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (target: Function) => {
        Reflect.defineMetadata(`data:dependencyInfo`, getDependencyInfo, target);
    };
}
