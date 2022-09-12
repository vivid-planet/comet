export interface RootBlockEntityOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isVisible?: (entity: any) => boolean;
}
export function RootBlockEntity(options: RootBlockEntityOptions = {}): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Function) {
        console.log("RootBlockEntity options ", options);
        console.log("RootBlockEntity target ", target);

        Reflect.defineMetadata(`data:rootBlockEntityOptions`, options, target);
    };
}
