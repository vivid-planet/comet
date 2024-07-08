export interface CrudGeneratorOptions {
    targetDirectory: string;
    requiredPermission?: string[] | string;
    create?: boolean;
    update?: boolean;
    delete?: boolean;
    list?: boolean;
    paging?: boolean;
}

export function CrudGenerator({
    targetDirectory,
    requiredPermission,
    create = true,
    update = true,
    delete: deleteMutation = true,
    list = true,
    paging = true,
}: CrudGeneratorOptions): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Function) {
        Reflect.defineMetadata(
            `data:crudGeneratorOptions`,
            { targetDirectory, requiredPermission, create, update, delete: deleteMutation, list, paging },
            target,
        );
    };
}

export interface CrudSingleGeneratorOptions {
    targetDirectory: string;
    requiredPermission?: string[] | string;
}

export function CrudSingleGenerator(options: CrudSingleGeneratorOptions): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Function) {
        Reflect.defineMetadata(`data:crudSingleGeneratorOptions`, options, target);
    };
}

export interface CrudFieldOptions {
    resolveField?: boolean; //only for relations, for others customize using @Field
    dedicatedResolverArg?: boolean; //only for ManyToOne relations
    search?: boolean;
    filter?: boolean;
    sort?: boolean;
    input?: boolean;
}

export function CrudField({
    resolveField = true,
    dedicatedResolverArg = false,
    search = true,
    filter = true,
    sort = true,
    input = true,
}: CrudFieldOptions = {}): PropertyDecorator {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (target: any, propertyKey: string | symbol) {
        Reflect.defineMetadata(
            `data:crudField`,
            { resolveField, dedicatedResolverArg, search, filter, sort, input },
            target.constructor,
            propertyKey,
        );
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasFieldFeature(metadataClass: any, propName: string, option: keyof CrudFieldOptions): boolean {
    const crudField = (Reflect.getMetadata(`data:crudField`, metadataClass, propName) ?? {}) as CrudFieldOptions;
    const defaultValue = option == "dedicatedResolverArg" ? false : true;
    return crudField[option] ?? defaultValue;
}
