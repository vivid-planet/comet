import {
    AbstractAccessControlService,
    ContentScopesForUser,
    ContentScopeWithLabel,
    Permission,
    PermissionsForUser,
    User,
    UserPermissions,
} from "@comet/cms-api";
import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Department } from "@src/department/entities/department.entity";

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

    async getAvailableContentScopes(): Promise<ContentScopeWithLabel[]> {
        const departments = await this.entityManager.find(Department, {});

        return departments.map((department) => ({
            scope: { department: department.id },
            label: { department: department.name },
        }));
    }
}
