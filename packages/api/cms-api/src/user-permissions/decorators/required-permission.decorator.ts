import { CustomDecorator, SetMetadata } from "@nestjs/common";

import { Permission } from "../interfaces/user-permission.interface";

type RequiredPermissionOptions = {
    skipScopeCheck?: boolean;
};

export type RequiredPermissionMetadata = {
    requiredPermission: (keyof Permission)[];
    options: RequiredPermissionOptions | undefined;
};

export const RequiredPermission = (
    requiredPermission: (keyof Permission)[] | keyof Permission,
    options?: RequiredPermissionOptions,
): CustomDecorator<string> => {
    return SetMetadata<string, RequiredPermissionMetadata>("requiredPermission", {
        requiredPermission: Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission],
        options,
    });
};
