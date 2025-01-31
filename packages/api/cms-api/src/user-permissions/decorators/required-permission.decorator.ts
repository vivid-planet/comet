import { type CustomDecorator, SetMetadata } from "@nestjs/common";

type RequiredPermissionOptions = {
    skipScopeCheck?: boolean;
};

export type RequiredPermissionMetadata = {
    requiredPermission: string[];
    options: RequiredPermissionOptions | undefined;
};

export const DisablePermissionCheck = "disablePermissionCheck";

export const RequiredPermission = (
    requiredPermission: string | string[] | "disablePermissionCheck",
    options?: RequiredPermissionOptions,
): CustomDecorator<string> => {
    return SetMetadata<string, RequiredPermissionMetadata>("requiredPermission", {
        requiredPermission: Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission],
        options,
    });
};
