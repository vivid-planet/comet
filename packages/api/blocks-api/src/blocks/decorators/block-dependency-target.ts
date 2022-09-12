export interface BlockDependencyTargetOptions {
    tableName: string;
}

export function BlockDependencyTarget(options: BlockDependencyTargetOptions): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Function) {
        console.log("BlockDependencyTarget options ", options);
        console.log("BlockDependencyTarget target ", target);
        console.log("BlockDependencyTarget entityName ", target.name);

        Reflect.defineMetadata(`data:blockDependencyTargetOptions`, options, target);
    };
}
