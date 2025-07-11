import { type CustomDecorator, SetMetadata } from "@nestjs/common";

import { type Permission } from "../user-permissions.types";

type RequiredPermissionOptions = {
    skipScopeCheck?: boolean;
};

export const DisablePermissionCheck = "disablePermissionCheck";
export type DisablePermissionCheckType = typeof DisablePermissionCheck;

export type RequiredPermissionMetadata = {
    requiredPermission: Array<Permission | DisablePermissionCheckType>;
    options: RequiredPermissionOptions | undefined;
};

export const RequiredPermission = (
    requiredPermission: Permission | Permission[] | DisablePermissionCheckType,
    options?: RequiredPermissionOptions,
): CustomDecorator<string> => {
    return SetMetadata<string, RequiredPermissionMetadata>("requiredPermission", {
        requiredPermission: Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission],
        options,
    });
};
