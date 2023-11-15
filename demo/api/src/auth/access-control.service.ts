import {
    AccessControlServiceInterface,
    ContentScope,
    ContentScopesForUser,
    CurrentUserInterface,
    PermissionsForUser,
    User,
    UserPermissions,
} from "@comet/cms-api";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AccessControlService implements AccessControlServiceInterface {
    canAccessScope(requestScope: ContentScope, user: CurrentUserInterface): boolean {
        if (!user.domains) return true; //all domains
        return user.domains.includes(requestScope.domain);
    }
    getPermissionsForUser(user: User): PermissionsForUser {
        if (user.email.endsWith("@comet-dxp.com")) {
            return UserPermissions.allPermissions;
        } else {
            return [{ permission: "news" }];
        }
    }
    getContentScopesForUser(user: User): ContentScopesForUser {
        if (user.email.endsWith("@comet-dxp.com")) {
            return UserPermissions.allContentScopes;
        } else {
            return [{ domain: "main", language: "en" }];
        }
    }
}
