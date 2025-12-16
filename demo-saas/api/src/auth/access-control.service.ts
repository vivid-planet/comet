import {
    AbstractAccessControlService,
    ContentScopesForUser,
    ContentScopeWithLabel,
    Permission,
    PermissionsForUser,
    User,
    UserPermissions,
} from "@comet/cms-api";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Department } from "@src/department/entities/department.entity";
import { AsyncLocalStorage } from "async_hooks";

@Injectable()
export class AccessControlService extends AbstractAccessControlService {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly asyncLocalStorage: AsyncLocalStorage<{ tenantId?: string }>,
    ) {
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
            // TODO: when RLS is implemented, set tenant id from header
            const departments = await this.entityManager.findAll(Department);
            if (departments.length > 0) {
                return [{ department: departments[0].id }];
            }
            return [];
        }
    }

    async getAvailableContentScopes(): Promise<ContentScopeWithLabel[]> {
        const store = this.asyncLocalStorage.getStore();

        return this.entityManager.transactional(async (entityManager) => {
            if (store?.tenantId) {
                await entityManager.execute(`SELECT set_config('app.tenant', '${store.tenantId}', TRUE)`);
            }

            const departments = await this.entityManager.findAll(Department, { where: { tenant: { id: store?.tenantId } } });
            return departments.map((department) => ({
                department: department.id,
                scope: { department: department.id },
                label: { department: department.name },
            }));
        });
    }
}
