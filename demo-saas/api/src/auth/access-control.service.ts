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
    async getContentScopesForUser(user: User): Promise<ContentScopesForUser> {
        if (user.isAdmin) {
            return UserPermissions.allContentScopes;
        } else {
            // TODO: instead of randomly taking one, take the departments the user is assigned to
            // Needs to be implemented when user assignment is implemented
            const departments = await this.entityManager.find(Department, {}, { limit: 1 });
            if (departments.length > 0) {
                return [{ department: departments[0].id }];
            }
            return [];
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
