import {
    AbstractAccessControlService,
    ContentScope,
    ContentScopesForUser,
    Permission,
    PermissionsForUser,
    User,
    UserPermissions,
} from "@comet/cms-api";
import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { TenantScope } from "@src/tenant/entities/tenant-scope.entity";

@Injectable()
export class AccessControlService extends AbstractAccessControlService {
    constructor(private readonly entityManager: EntityManager) {
        super();
    }

    getPermissionsForUser(user: User, availablePermissions: Permission[]): PermissionsForUser {
        if (user.isAdmin) {
            return UserPermissions.allPermissions;
        } else {
            const deniedPermissions: Permission[] = ["userPermissions"];
            return availablePermissions.filter((permission) => !deniedPermissions.includes(permission)).map((permission) => ({ permission }));
        }
    }
    getContentScopesForUser(user: User): ContentScopesForUser {
        if (user.isAdmin) {
            return UserPermissions.allContentScopes;
        } else {
            return [{ domain: "main", language: "en" }];
        }
    }

    async getAvailableContentScopes(): Promise<ContentScope[]> {
        const tenantScopes = await this.entityManager.find(TenantScope, {});

        return tenantScopes.map((scope) => ({
            domain: scope.domain,
            language: scope.language,
        }));
    }
}
