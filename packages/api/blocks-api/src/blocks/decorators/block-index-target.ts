export function BlockIndexTarget(): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Function) {
        Reflect.defineMetadata(`data:blockIndexTargetEntityName`, target.name, target);
    };
}
