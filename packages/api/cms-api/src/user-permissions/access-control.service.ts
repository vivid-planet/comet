import { Injectable } from "@nestjs/common";

import { CurrentUserInterface } from "../auth/current-user/current-user";
import { ContentScope } from "./interfaces/content-scope.interface";
import { AccessControlServiceInterface } from "./user-permissions.types";

@Injectable()
export class AccessControlService implements AccessControlServiceInterface {
    canAccessScope(requestScope: ContentScope, user: CurrentUserInterface): boolean {
        if (!user.contentScopes) return false;
        return user.contentScopes.some((cs) => Object.entries(requestScope).every(([scope, value]) => cs[scope] === value));
    }
}
