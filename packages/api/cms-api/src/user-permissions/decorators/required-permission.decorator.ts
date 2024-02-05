import { EntityClass, EntityManager } from "@mikro-orm/core";
import { CustomDecorator, SetMetadata } from "@nestjs/common";
import { Request } from "express";

import { CurrentUser } from "../dto/current-user";
import { ContentScope } from "../interfaces/content-scope.interface";
import { Permission } from "../interfaces/user-permission.interface";
import { AllowedPermission } from "../user-permissions.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequiredPermissionArgs<ArgsType = any> = {
    args: ArgsType;
    getScopeFromEntity: (entityClass: EntityClass<object>, id: string) => Promise<ContentScope>;
    user: CurrentUser;
    entityManager: EntityManager;
    request: Request;
};

type RequiredPermissionOptions = {
    skipScopeCheck?: boolean;
};

export type RequiredPermission = {
    requiredPermission: AllowedPermission<keyof Permission>[];
    options: RequiredPermissionOptions | undefined;
};

export const RequiredPermission = <P extends keyof Permission>(
    requiredPermission: AllowedPermission<P>[],
    options?: RequiredPermissionOptions,
): CustomDecorator<string> => {
    return SetMetadata<string, RequiredPermission>("requiredPermission", { requiredPermission, options });
};
