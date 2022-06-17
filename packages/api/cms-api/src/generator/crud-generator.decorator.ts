export interface CrudGeneratorOptions {
    targetDirectory: string;
}

export function CrudGenerator(options: CrudGeneratorOptions): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Function) {
        Reflect.defineMetadata(`data:crudGeneratorOptions`, options, target);
    };
}

export interface CrudSingleGeneratorOptions {
    targetDirectory: string;
}

export function CrudSingleGenerator(options: CrudSingleGeneratorOptions): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Function) {
        Reflect.defineMetadata(`data:crudSingleGeneratorOptions`, options, target);
    };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CrudQueryOptions {
    //nothing so far
}

/**
 * Mark a property as seachable by query parameter in CRUD Generator
 */
export function CrudQuery(options: CrudQueryOptions = {}): PropertyDecorator {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (target: any, propertyKey: string | symbol) {
        Reflect.defineMetadata(`data:crudQuery`, options, target.constructor, propertyKey);
    };
}
