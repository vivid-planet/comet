import { AbstractAccessControlService, ContentScopesForUser, PermissionsForUser, User, UserPermissions } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AccessControlService extends AbstractAccessControlService {
    getPermissionsForUser(user: User): PermissionsForUser {
        if (user.isAdmin) {
            return UserPermissions.allPermissions;
        } else {
            return [
                { permission: "products" },
                { permission: ["news.read", "news.update"], contentScopes: [{ domain: "secondary", language: "en" }] },
            ];
        }
    }
    getContentScopesForUser(user: User): ContentScopesForUser {
        if (user.isAdmin) {
            return UserPermissions.allContentScopes;
        } else {
            return [{ domain: "main", language: "en" }];
        }
    }
}
