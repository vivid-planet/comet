import { EntityClass, EntityManager } from "@mikro-orm/core";
import { CustomDecorator, SetMetadata } from "@nestjs/common";
import { Request } from "express";

import { CurrentUser } from "../dto/current-user";
import { ContentScope } from "../interfaces/content-scope.interface";
import { Permission } from "../interfaces/user-permission.interface";

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

export const RequiredPermission = (
    requiredPermission: (keyof Permission)[] | keyof Permission,
    options?: RequiredPermissionOptions,
): CustomDecorator<string> => {
    return SetMetadata("requiredPermission", { requiredPermission, options });
};
