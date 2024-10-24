import { Injectable } from "@nestjs/common";

import { CurrentUser } from "./dto/current-user";
import { ContentScope } from "./interfaces/content-scope.interface";
import { AccessControlServiceInterface } from "./user-permissions.types";

@Injectable()
export abstract class AbstractAccessControlService implements AccessControlServiceInterface {
    private checkContentScope(userContentScopes: ContentScope[], targetContentScope: ContentScope): boolean {
        return userContentScopes.some((userContentScope) =>
            Object.entries(targetContentScope).every(([dimension, targetContentScopeValue]) => {
                const userContentScopeValue = (userContentScope as Record<string, unknown>)[dimension];

                // Treat null and undefined the same
                if (userContentScopeValue == null && targetContentScopeValue == null) {
                    return true;
                }

                return userContentScopeValue === targetContentScopeValue;
            }),
        );
    }
    isAllowed(user: CurrentUser, permission: string, contentScope?: ContentScope): boolean {
        if (!user.permissions) return false;
        const [requiredMainPermission, requiredSubPermission] = permission.split(".");

        return user.permissions.some((p) => {
            const [mainPermission, subPermission] = p.permission.split(".");
            if (mainPermission !== requiredMainPermission) return false;
            if (subPermission && subPermission !== requiredSubPermission) return false;

            if (!contentScope) return true;

            return this.checkContentScope(p.contentScopes, contentScope);
        });
    }
}
