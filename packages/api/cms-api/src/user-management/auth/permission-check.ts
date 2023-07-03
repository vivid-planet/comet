import { EntityClass, EntityManager } from "@mikro-orm/core";
import { CustomDecorator, SetMetadata } from "@nestjs/common";
import { Request } from "express";

import { ContentScope } from "../../common/decorators/content-scope.interface";
import { CurrentUser } from "../current-user";
import { UserPermission } from "../entities/user-permission.entity";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PermissionCheckArgs<ArgsType = any> = {
    args: ArgsType;
    getScopeFromEntity: (entityClass: EntityClass<object>, id: string) => Promise<ContentScope>;
    user: CurrentUser;
    entityManager: EntityManager;
    request: Request;
};

export type PermissionCheckOptions = {
    entityClass?: EntityClass<object>;
    isAllowed?: (args: PermissionCheckArgs) => Promise<boolean> | boolean;
    getScopeFromMeta?: (args: PermissionCheckArgs) => Promise<ContentScope>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getScopeFromArgs?: (args: any) => ContentScope;
    allowedForPermissions?: (string | UserPermission)[];
    skipScopeCheck?: boolean;
};

export const PermissionCheck = (options: PermissionCheckOptions): CustomDecorator<string> => {
    return SetMetadata("permissionCheck", options);
};
