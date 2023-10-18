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
    // args: DependencyInfoOptions<Entity> | DependencyInfoServiceInterface<Entity>,
    args: Type<DependencyInfoServiceInterface<Entity>>,
): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (target: Function) => {
        let options = {};

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

        console.log("options ", options);

        // Reflect.defineMetadata(`data:dependencyInfo`, options, target);
        Reflect.defineMetadata(`data:dependencyInfo`, options, target);

        // Reflect.defineMetadata(`data:dependencyInfo`, { abc: "abc" }, target);

        // const originalMethod = descriptor!.value;
        //
        // descriptor!.value = async function (...args: any[]) {
        //     try {
        //         // @ts-ignore
        //         const service: FilesService = this.filesService;
        //         console.log("service ", service);
        //         return;
        //     } catch (err) {
        //         console.error(err);
        //         return;
        //     }
        // };
        // let options: DependencyInfoOptions<Entity>;
        // const fs = getFromContainer(FilesService);
        // console.log("fs ", fs);
        // console.log("fs ", fs.findAll({}));
        //
        // console.log(injectYourService);
        //
        // injectYourService(target, "yourservice");
        // // @ts-ignore
        // console.log(target.yourservice);
        // // @ts-ignore
        // const yourservice: DependencyInfoServiceInterface<Entity> = this?.yourservice;
        // // @ts-ignore
        // console.log((this as any)?.yourservice);
        // console.log(yourservice);
        // console.log("yourservice ", yourservice);
        // if ("getDependencyInfo" in args) {
        //     options = {
        //         getName: async (entity) => {
        //             const info = await args.getDependencyInfo(entity);
        //             return info.name;
        //         },
        //         getSecondaryInformation: async (entity) => {
        //             const info = await args.getDependencyInfo(entity);
        //             return info.secondaryInformation;
        //         },
        //     };
        // } else {
        //     options = {
        //         getName: args.getName,
        //         getSecondaryInformation: args.getSecondaryInformation,
        //     };
        // }
        // Reflect.defineMetadata(`data:dependencyInfo`, options, target);
    };
}
