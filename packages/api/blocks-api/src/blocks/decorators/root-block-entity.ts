export function RootBlockEntity(): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Function) {
        Reflect.defineMetadata(`data:blockIndexRootEntityName`, target.name, target);
    };
}
