import { Injectable } from "@nestjs/common";

import { CurrentUser } from "./dto/current-user";
import { ContentScope } from "./interfaces/content-scope.interface";
import { AccessControlServiceInterface } from "./user-permissions.types";

@Injectable()
export abstract class AbstractAccessControlService implements AccessControlServiceInterface {
    private checkContentScope(userContentScopes: ContentScope[], contentScope: ContentScope): boolean {
        return userContentScopes.some((cs) => Object.entries(contentScope).every(([scope, value]) => cs[scope] === value));
    }
    isAllowed(user: CurrentUser, permission: string, contentScope?: ContentScope): boolean {
        if (!user.permissions) return false;
        return user.permissions.some((p) => p.permission === permission && (!contentScope || this.checkContentScope(p.contentScopes, contentScope)));
    }
}
