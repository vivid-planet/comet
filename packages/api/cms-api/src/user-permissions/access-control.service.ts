import { Injectable } from "@nestjs/common";

import { CurrentUserInterface } from "../auth/current-user/current-user";
import { ContentScope } from "./interfaces/content-scope.interface";
import { Permission } from "./interfaces/user-permission.interface";
import { AccessControlServiceInterface } from "./user-permissions.types";

@Injectable()
export abstract class AbstractAccessControlService implements AccessControlServiceInterface {
    canAccessScope(requestScope: ContentScope, user: CurrentUserInterface): boolean {
        if (!user.contentScopes) return false;
        return user.contentScopes.some((cs) => Object.entries(requestScope).every(([scope, value]) => cs[scope] === value));
    }

    isAllowed(user: CurrentUserInterface, permission: keyof Permission): boolean {
        if (!user.permissions) return false;
        return user.permissions.some((p) => p.permission === permission);
    }
}
