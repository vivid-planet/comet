import { AbstractAccessControlService, ContentScopesForUser, PermissionsForUser, User, UserPermissions } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AccessControlService extends AbstractAccessControlService {
    getPermissionsForUser(user: User, availablePermissions: string[]): PermissionsForUser {
        if (user.isAdmin) {
            return UserPermissions.allPermissions;
        } else {
            const deniedPermissions = ["userPermissions", "news"];
            return [
                ...availablePermissions.filter((permission) => !deniedPermissions.includes(permission)).map((permission) => ({ permission })),
                { permission: "news", contentScopes: [{ domain: "main", language: "en" }] },
            ];
        }
    }
    getContentScopesForUser(user: User): ContentScopesForUser {
        if (user.isAdmin) {
            return UserPermissions.allContentScopes;
        } else {
            return [
                { domain: "main", language: "en" },
                { domain: "main", language: "de" },
            ];
        }
    }
}
