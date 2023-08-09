import { Injectable } from "@nestjs/common";

import { CurrentUserInterface } from "../auth/current-user/current-user";
import { CurrentUserContentScope } from "./dto/current-user";
import { ContentScope } from "./interfaces/content-scope.interface";
import { Permission } from "./interfaces/user-permission.interface";
import { PermissionConfiguration } from "./user-permissions.types";

export type AllowedPermission =
    | {
          permission: keyof Permission;
          configuration?: PermissionConfiguration;
      }
    | keyof Permission;

@Injectable()
export class AccessControlService {
    canAccessScope(requestScope: ContentScope, user: CurrentUserInterface): boolean {
        return this.isAllowed(user, "pageTree", requestScope);
    }

    isAllowed(user: CurrentUserInterface, permission: AllowedPermission, contentScope?: ContentScope): boolean {
        return this._isAllowed(user, permission, contentScope);
    }

    _isAllowed(user: CurrentUserInterface, permission: AllowedPermission, contentScope?: ContentScope): boolean {
        if (!user.permissions) return false;
        if (typeof permission === "string") {
            return user.permissions.some(
                (p) =>
                    p.permission === permission &&
                    this.checkContentScope(p.overrideContentScopes ? p.contentScopes : user.contentScopes ?? [], contentScope),
            );
        } else {
            return user.permissions.some(
                (p) =>
                    p.permission === permission.permission &&
                    this.checkPermissionConfiguration(permission.configuration, p.configuration) &&
                    this.checkContentScope(p.overrideContentScopes ? p.contentScopes : user.contentScopes ?? [], contentScope),
            );
        }
    }

    private checkPermissionConfiguration(c1?: PermissionConfiguration, c2?: PermissionConfiguration): boolean {
        if (!c1) return true;
        if (!c2) return false;
        for (const key of Object.keys(c1)) {
            if (c1[key] !== c2[key]) return false;
        }
        return true;
    }

    private checkContentScope(contentScopes: CurrentUserContentScope[], contentScope?: ContentScope) {
        if (!contentScope) return true;
        return Object.keys(contentScope).every((scope) =>
            contentScopes.find((cs) => cs.scope === scope)?.values.some((v) => v === contentScope[scope as keyof ContentScope]),
        );
    }
}
