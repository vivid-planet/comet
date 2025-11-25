import { type Type } from "@nestjs/common";

import { type CurrentUser } from "../../user-permissions/dto/current-user";
import { type Permission } from "../../user-permissions/user-permissions.types";

export interface CrudGeneratorHooksService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validateCreateInput?: (input: any, options: { currentUser: CurrentUser }) => Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validateUpdateInput?: (input: any, options: { currentUser: CurrentUser }) => Promise<void>;
}

export interface CrudGeneratorOptions {
    targetDirectory: string;
    requiredPermission: Permission | Permission[];
    create?: boolean;
    update?: boolean;
    delete?: boolean;
    list?: boolean;
    single?: boolean;
    position?: { groupByFields: string[] };
    hooksService?: Type<CrudGeneratorHooksService>;
}

export const CRUD_GENERATOR_METADATA_KEY = "data:crudGeneratorOptions";

export function CrudGenerator({
    targetDirectory,
    requiredPermission,
    create = true,
    update = true,
    delete: deleteMutation = true,
    list = true,
    single = true,
    position,
    hooksService,
}: CrudGeneratorOptions): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    return function (target: Function) {
        Reflect.defineMetadata(
            CRUD_GENERATOR_METADATA_KEY,
            { targetDirectory, requiredPermission, create, update, delete: deleteMutation, list, single, position, hooksService },
            target,
        );
    };
}

export interface CrudSingleGeneratorOptions {
    targetDirectory: string;
    requiredPermission: Permission | Permission[];
}

export const CRUD_SINGLE_GENERATOR_METADATA_KEY = "data:crudSingleGeneratorOptions";

export function CrudSingleGenerator(options: CrudSingleGeneratorOptions): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    return function (target: Function) {
        Reflect.defineMetadata(CRUD_SINGLE_GENERATOR_METADATA_KEY, options, target);
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

export const CRUD_FIELD_METADATA_KEY = "data:crudField";

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
            CRUD_FIELD_METADATA_KEY,
            { resolveField, dedicatedResolverArg, search, filter, sort, input },
            target.constructor,
            propertyKey,
        );
    };
}
