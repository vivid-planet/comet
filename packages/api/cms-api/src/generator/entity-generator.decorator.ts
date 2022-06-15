// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EntityGeneratorOptions {
    targetDirectory: string;
}

export function EntityGenerator(options: EntityGeneratorOptions): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Function) {
        Reflect.defineMetadata(`data:entityGeneratorOptions`, options, target);
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
