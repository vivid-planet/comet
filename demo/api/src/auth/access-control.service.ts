import { AbstractAccessControlService, ContentScopesForUser, PermissionsForUser, User, UserPermissions } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AccessControlService extends AbstractAccessControlService {
    getPermissionsForUser(user: User): PermissionsForUser {
        if (user.isAdmin) {
            return UserPermissions.allPermissions;
        } else if (user.name.startsWith("Superuser")) {
            return [{ permission: "products" }, { permission: "news", contentScopes: [{ domain: "secondary", language: "en" }] }];
        } else {
            return [];
        }
    }
    getContentScopesForUser(user: User): ContentScopesForUser {
        if (user.isAdmin) {
            return UserPermissions.allContentScopes;
        } else if (user.name.startsWith("Superuser")) {
            return [{ domain: "main", language: "en" }];
        } else {
            return [];
        }
    }
}
