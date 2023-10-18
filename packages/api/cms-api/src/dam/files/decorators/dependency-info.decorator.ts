import { AnyEntity } from "@mikro-orm/core";
import { Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

export interface DependencyInfoServiceInterface<Entity extends AnyEntity> {
    getDependencyInfo: (entity: Entity) =>
        | Promise<{
              name: string;
              secondaryInformation: string;
          }>
        | {
              name: string;
              secondaryInformation: string;
          };
}

export interface DependencyInfoOptions<Entity extends AnyEntity> {
    getName: (item: Entity, moduleRef: ModuleRef) => Promise<string> | string;
    getSecondaryInformation: (item: Entity, moduleRef: ModuleRef) => Promise<string> | string;
}

export function DependencyInfo<Entity extends AnyEntity>(
    args: DependencyInfoOptions<Entity> | Type<DependencyInfoServiceInterface<Entity>>,
): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (target: Function) => {
        let options = {};

        if (typeof args === "function") {
            options = {
                getName: async (entity, moduleRef) => {
                    const service: DependencyInfoServiceInterface<Entity> = moduleRef.get(args, { strict: false });
                    const info = await service.getDependencyInfo(entity);
                    return info.name;
                },
                getSecondaryInformation: async (entity, moduleRef) => {
                    const service: DependencyInfoServiceInterface<Entity> = moduleRef.get(args, { strict: false });
                    const info = await service.getDependencyInfo(entity);
                    return info.secondaryInformation;
                },
            } as DependencyInfoOptions<Entity>;
        } else {
            options = {
                getName: async (entity, moduleRef) => {
                    const name = await args.getName(entity, moduleRef);
                    return name;
                },
                getSecondaryInformation: async (entity, moduleRef) => {
                    const secondaryInformation = await args.getSecondaryInformation(entity, moduleRef);
                    return secondaryInformation;
                },
            } as DependencyInfoOptions<Entity>;
        }

        Reflect.defineMetadata(`data:dependencyInfo`, options, target);
    };
}
