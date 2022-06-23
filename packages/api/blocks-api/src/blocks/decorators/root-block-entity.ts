export interface RootBlockEntityOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isVisible?: (entity: any) => boolean;
}
export function RootBlockEntity(options: RootBlockEntityOptions = {}): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Function) {
        Reflect.defineMetadata(`data:rootBlockEntityOptions`, options, target);
    };
}
