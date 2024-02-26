import { Injectable } from "@nestjs/common";

import { CurrentUser } from "./dto/current-user";
import { ContentScope } from "./interfaces/content-scope.interface";
import { AccessControlServiceInterface } from "./user-permissions.types";

@Injectable()
export abstract class AbstractAccessControlService implements AccessControlServiceInterface {
    isAllowed(user: CurrentUser, permission: string, contentScope?: ContentScope): boolean {
        if (!user.permissions) return false;
        return user.permissions.some((p) => {
            if (p.permission !== permission) return false;
            if (!contentScope) return true;
            const contentScopes = p.contentScopes || user.contentScopes;
            if (contentScopes === null) return true;
            return contentScopes.some((cs) => Object.entries(contentScope).every(([scope, value]) => cs[scope] === value));
        });
    }
}
