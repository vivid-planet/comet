import { CustomDecorator, SetMetadata } from "@nestjs/common";

import { Permission } from "../dto/permission";
import { UserPermissionsService } from "../user-permissions.service";

type RequiredPermissionOptions = {
    skipScopeCheck?: boolean;
};

export type RequiredPermissionMetadata = {
    requiredPermission: Permission[];
    options: {
        skipScopeCheck: boolean;
        disablePermissionCheck: boolean;
    };
};

export const DisablePermissionCheck = "disablePermissionCheck";

export const RequiredPermission = (
    requiredPermission: (string | Permission) | (string | Permission)[] | "disablePermissionCheck",
    options?: RequiredPermissionOptions,
): CustomDecorator<string> => {
    return SetMetadata<string, RequiredPermissionMetadata>("requiredPermission", {
        requiredPermission:
            requiredPermission === "disablePermissionCheck"
                ? []
                : (Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission]).map((p) =>
                      UserPermissionsService.parsePermission(p),
                  ),
        options: {
            skipScopeCheck: options?.skipScopeCheck === true,
            disablePermissionCheck: requiredPermission === "disablePermissionCheck",
        },
    });
};
