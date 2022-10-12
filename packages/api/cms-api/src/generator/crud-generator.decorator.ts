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

export interface CrudFieldOptions {
    search?: boolean;
    filter?: boolean;
    sort?: boolean;
    input?: boolean;
}

export function CrudField({ search = true, filter = true, sort = true, input = true }: CrudFieldOptions = {}): PropertyDecorator {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (target: any, propertyKey: string | symbol) {
        Reflect.defineMetadata(`data:crudField`, { search, filter, sort, input }, target.constructor, propertyKey);
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasFieldFeature(metadataClass: any, propName: string, option: keyof CrudFieldOptions): boolean {
    const crudField = (Reflect.getMetadata(`data:crudField`, metadataClass, propName) ?? {}) as CrudFieldOptions;
    return crudField[option] ?? true;
}
