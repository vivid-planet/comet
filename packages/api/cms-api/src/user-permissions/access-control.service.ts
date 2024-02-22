import { Injectable } from "@nestjs/common";

import { CurrentUser } from "./dto/current-user";
import { ContentScope } from "./interfaces/content-scope.interface";
import { AccessControlServiceInterface } from "./user-permissions.types";

@Injectable()
export abstract class AbstractAccessControlService implements AccessControlServiceInterface {
    isAllowed(user: CurrentUser, permission: string, contentScope?: ContentScope): boolean {
        if (!user.permissions) return false;
        const [requiredMainPermission, requiredSubPermission] = permission.split(".");

        return user.permissions.some((p) => {
            const [mainPermission, subPermission] = p.permission.split(".");
            if (mainPermission !== requiredMainPermission) return false;
            if (subPermission && subPermission !== requiredSubPermission) return false;

            if (!contentScope) return true;

            return p.contentScopes.some((cs) => Object.entries(contentScope).every(([scope, value]) => cs[scope] === value));
        });
    }
}
