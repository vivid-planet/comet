import { Injectable } from "@nestjs/common";

import { CurrentUser } from "./dto/current-user";
import { ContentScope } from "./interfaces/content-scope.interface";
import { Permission } from "./interfaces/user-permission.interface";
import { AccessControlServiceInterface, AllowedPermission } from "./user-permissions.types";

@Injectable()
export abstract class AbstractAccessControlService implements AccessControlServiceInterface {
    isAllowed(user: CurrentUser, permission: AllowedPermission<keyof Permission>, contentScope?: ContentScope): boolean {
        if (!user.permissions) return false;
        return user.permissions.some((p) => {
            let requiredPermission: keyof Permission;
            let requiredConfiguration: Record<string, unknown> | null = null;
            if (typeof permission === "string") {
                requiredPermission = permission;
            } else {
                requiredPermission = permission.permission;
                requiredConfiguration = permission.configuration as Record<string, unknown>;
            }

            if (p.permission !== requiredPermission) return false;

            if (requiredConfiguration) {
                if (!p.configuration) return false;
                for (const key of Object.keys(requiredConfiguration)) {
                    if (requiredConfiguration[key] !== p.configuration[key]) return false;
                }
            }

            const contentScopes = p.contentScopes || user.contentScopes;
            if (!contentScope || contentScopes === null) return true;
            return contentScopes.some((cs) => Object.entries(contentScope).every(([scope, value]) => cs[scope] === value));
        });
    }
}
