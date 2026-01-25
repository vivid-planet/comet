import { AbstractAccessControlService, ContentScopesForUser, Permission, PermissionsForUser, User, UserPermissions } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AccessControlService extends AbstractAccessControlService {
    getPermissionsForUser(user: User, availablePermissions: Permission[]): PermissionsForUser {
        if (user.isAdmin) {
            return UserPermissions.allPermissions;
        } else {
            return [{ permission: "dam" }];
            // const deniedPermissions: Permission[] = ["userPermissions"];
            // return availablePermissions.filter((permission) => !deniedPermissions.includes(permission)).map((permission) => ({ permission }));
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
