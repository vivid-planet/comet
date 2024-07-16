import { Injectable } from "@nestjs/common";

import { CurrentUser } from "./dto/current-user";
import { Permission } from "./dto/permission";
import { ContentScope } from "./interfaces/content-scope.interface";
import { UserPermissionsService } from "./user-permissions.service";
import { AccessControlServiceInterface } from "./user-permissions.types";

@Injectable()
export abstract class AbstractAccessControlService implements AccessControlServiceInterface {
    isAllowed(user: CurrentUser, permission: string | Permission, contentScope?: ContentScope): boolean {
        if (!user.permissions) return false;

        const { permission: requiredPermission, configuration: requiredConfiguration } = UserPermissionsService.parsePermission(permission);

        return user.permissions.some((p) => {
            if (p.permission !== requiredPermission) return false;

            if (requiredConfiguration) {
                if (!p.configuration) return false;
                for (const key of Object.keys(requiredConfiguration)) {
                    if (requiredConfiguration[key] !== p.configuration[key]) return false;
                }
            }

            if (!contentScope) return true;
            return p.contentScopes.some((cs) => Object.entries(contentScope).every(([scope, value]) => cs[scope] === value));
        });
    }
}
