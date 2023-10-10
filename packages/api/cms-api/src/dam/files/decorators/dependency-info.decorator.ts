import { AnyEntity } from "@mikro-orm/core";

import { FilesService } from "../files.service";

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
    getName: (item: Entity) => Promise<string> | string;
    getSecondaryInformation: (item: Entity) => Promise<string> | string;
}

export function DependencyInfo<Entity extends AnyEntity>(
    // args: DependencyInfoOptions<Entity> | DependencyInfoServiceInterface<Entity>,
    // args: DependencyInfoServiceInterface<Entity>,
    args: any,
): ClassDecorator {
    // const injector = Inject(FilesService);

    // eslint-disable-next-line @typescript-eslint/ban-types
    return (target: Function, _key?: string | symbol) => {
        console.log("args ", args);

        let options = {};

        console.log("class");
        options = {
            // @ts-ignore
            getName: async (entity) => {
                const fs = getFromContainer(args) as FilesService;
                const info = await fs.getDependencyInfo(entity);
                return info.name;
            },
            // @ts-ignore
            getSecondaryInformation: async (entity) => {
                const fs = getFromContainer(args) as FilesService;
                const info = await fs.getDependencyInfo(entity);
                return info.secondaryInformation;
            },
        };

        console.log("options ", options);

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

// eslint-disable-next-line @typescript-eslint/ban-types
let container: { get<T>(someClass: { new (...args: any[]): T } | Function): T };

export function setContainer(iocContainer: { get(someClass: any): any }) {
    container = iocContainer;
}

// eslint-disable-next-line @typescript-eslint/ban-types
function getFromContainer<T>(someClass: { new (...args: any[]): T } | Function): T | undefined {
    if (container) {
        try {
            const instance = container.get(someClass);
            if (instance) return instance;

            console.error("Failed in try");
        } catch (error) {
            console.error("Failed in catch");
        }
    }
    console.error("No container");
    return undefined;
}
