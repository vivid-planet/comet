export interface CrudGeneratorOptions {
    targetDirectory: string;
    create?: boolean;
    update?: boolean;
    delete?: boolean;
}

export function CrudGenerator({
    targetDirectory,
    create = true,
    update = true,
    delete: deleteMutation = true,
}: CrudGeneratorOptions): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Function) {
        Reflect.defineMetadata(`data:crudGeneratorOptions`, { targetDirectory, create, update, delete: deleteMutation }, target);
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
    resolveField?: boolean; //only for relations, for others customize using @Field
    mainProperty?: boolean; //only for ManyToOne relations
    search?: boolean;
    filter?: boolean;
    sort?: boolean;
    input?: boolean;
}

export function CrudField({
    resolveField = true,
    mainProperty = false,
    search = true,
    filter = true,
    sort = true,
    input = true,
}: CrudFieldOptions = {}): PropertyDecorator {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (target: any, propertyKey: string | symbol) {
        Reflect.defineMetadata(`data:crudField`, { resolveField, mainProperty, search, filter, sort, input }, target.constructor, propertyKey);
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasFieldFeature(metadataClass: any, propName: string, option: keyof CrudFieldOptions): boolean {
    const crudField = (Reflect.getMetadata(`data:crudField`, metadataClass, propName) ?? {}) as CrudFieldOptions;
    const optionValue = crudField[option];
    if (optionValue !== undefined) {
        return optionValue;
    } else {
        //default value
        if (option == "mainProperty") {
            return false;
        } else {
            return true;
        }
    }
}
