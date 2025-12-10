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
import { Department } from "@src/tenant/entities/department.entity";

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
            return [{ department: "main" }];
        }
    }

    async getAvailableContentScopes(): Promise<ContentScope[]> {
        const departments = await this.entityManager.find(Department, {});

        return departments.map((department) => ({
            department: department.name,
        }));
    }
}
