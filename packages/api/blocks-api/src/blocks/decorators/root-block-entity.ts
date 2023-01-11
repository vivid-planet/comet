export function RootBlockEntity(blockIndexRootIdentifier: string): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Function) {
        Reflect.defineMetadata(`data:blockIndexRootIdentifier`, blockIndexRootIdentifier, target);
    };
}
