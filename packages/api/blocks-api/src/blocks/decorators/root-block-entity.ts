export interface RootBlockEntityOptions {
    isVisible?: (entity: unknown) => boolean;
}
export function RootBlockEntity(options: RootBlockEntityOptions = {}): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Function) {
        Reflect.defineMetadata(`data:rootBlockEntityOptions`, options, target);
    };
}
