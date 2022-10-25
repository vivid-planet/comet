export function BlockIndexTarget(targetIdentifier: string): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Function) {
        Reflect.defineMetadata(`data:blockIndexTargetIdentifier`, targetIdentifier, target);
    };
}
