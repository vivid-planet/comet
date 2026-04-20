import { Injectable } from "@nestjs/common";
import isEqual from "lodash.isequal";

import { CurrentUser, CurrentUserPermission } from "./dto/current-user";
import { ContentScope } from "./interfaces/content-scope.interface";
import { AccessControlServiceInterface, Permission } from "./user-permissions.types";

export interface PermissionMismatch {
    permission: Permission;
    missingContentScopes: ContentScope[];
}

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
    isAllowed(user: CurrentUser, permission: Permission, contentScope?: ContentScope): boolean {
        if (!user.permissions) {
            return false;
        }
        return user.permissions.some((p) => p.permission === permission && (!contentScope || this.checkContentScope(p.contentScopes, contentScope)));
    }

    /**
     * Compares two sets of permissions and returns the mismatches (missing permissions and content scopes).
     * Returns an empty array if the first set has equal or more permissions than the target set.
     */
    static getPermissionMismatches(permissions: CurrentUserPermission[], targetPermissions: CurrentUserPermission[]): PermissionMismatch[] {
        const mismatches: PermissionMismatch[] = [];
        for (const permission of targetPermissions) {
            const currentUserPermission = permissions.find((p) => p.permission === permission.permission);
            if (!currentUserPermission) {
                mismatches.push({ permission: permission.permission, missingContentScopes: [] });
            } else {
                const missingContentScopes = permission.contentScopes.filter(
                    (contentScope) => !currentUserPermission.contentScopes.find((cs) => isEqual(cs, contentScope)),
                );
                if (missingContentScopes.length > 0) {
                    mismatches.push({ permission: permission.permission, missingContentScopes });
                }
            }
        }
        return mismatches;
    }

    /**
     * @deprecated Use `getPermissionMismatches` instead.
     */
    static isEqualOrMorePermissions(permissions: CurrentUserPermission[], targetPermissions: CurrentUserPermission[]): boolean {
        return AbstractAccessControlService.getPermissionMismatches(permissions, targetPermissions).length === 0;
    }
}
