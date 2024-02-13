import { CustomDecorator, SetMetadata } from "@nestjs/common";

import { Permission } from "../interfaces/user-permission.interface";

type RequiredPermissionOptions = {
    skipScopeCheck?: boolean;
};

export type RequiredPermission = {
    requiredPermission: (keyof Permission)[] | keyof Permission;
    options: RequiredPermissionOptions | undefined;
};

export const RequiredPermission = (requiredPermission: (keyof Permission)[], options?: RequiredPermissionOptions): CustomDecorator<string> => {
    return SetMetadata<string, RequiredPermission>("requiredPermission", { requiredPermission, options });
};
