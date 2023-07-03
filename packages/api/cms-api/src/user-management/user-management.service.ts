import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import getUuid from "uuid-by-string";

import { CurrentUser, CurrentUserContentScope } from "./current-user";
import { FindUsersArgs } from "./dto/paginated-user-list";
import { User } from "./dto/user";
import { UserContentScope, UserContentScopes } from "./entities/user-content-scopes.entity";
import { UserPermission, UserPermissionSource } from "./entities/user-permission.entity";
import { UserModuleConfig } from "./user-management.module";
import { AvailableContentScope, AvailablePermissions, USER_MODULE_CONFIG, USERMANAGEMENT } from "./user-management.types";

@Injectable()
export class UserManagementService {
    constructor(
        @Inject(USER_MODULE_CONFIG) private readonly config: UserModuleConfig,
        @InjectRepository(UserContentScopes) private readonly contentScopeRepository: EntityRepository<UserContentScopes>,
        @InjectRepository(UserPermission) private readonly permissionRepository: EntityRepository<UserPermission>,
    ) {}

    async getPermission(id: string, userId?: string): Promise<UserPermission> {
        const permission = await this.permissionRepository.findOne(id);
        if (permission) return permission;
        if (!userId) {
            throw new Error(`Permission not found: ${id}`);
        }
        for (const p of await this.getPermissions(userId)) {
            if (p.id === id) return p;
        }
        throw new Error("Permission not found");
    }

    private async getAvailablePermissionNames(): Promise<string[]> {
        return Object.keys(await this.getAvailablePermissions());
    }

    async getUser(id: string): Promise<User> {
        return this.config.userService.getUser(id);
    }

    async findUsers(args: FindUsersArgs): Promise<[User[], number]> {
        return this.config.userService.findUsers(args);
    }

    async upsertPermission(permission: UserPermission): Promise<UserPermission> {
        const permissionNames = await this.getAvailablePermissionNames();
        if (!permissionNames.includes(permission.permission)) {
            throw new Error(`Permission not allowed: ${permission.permission}. Allowed Permissions are: ${permissionNames.join(", ")}`);
        }
        const availableContentScopes = await this.getAvailableContentScopes();
        permission.contentScopes?.forEach((contentScope) =>
            contentScope.values.forEach((value) => {
                const allowedContentScopes = Object.keys(availableContentScopes);
                if (!allowedContentScopes.includes(contentScope.scope)) {
                    throw new Error(`ContentScope does not exist: ${contentScope.scope}. Existing scopes: ${allowedContentScopes.join(", ")}`);
                }
                const allowedValues = availableContentScopes[contentScope.scope].values.map((v) => v.value);
                if (!allowedValues.includes(value)) {
                    throw new Error(`ContentScopeValue of ContentScope ${contentScope.scope} does not exist: ${value}.`);
                }
            }),
        );
        await this.permissionRepository.persistAndFlush(permission);
        return permission;
    }

    async deletePermission(id: string): Promise<void> {
        this.permissionRepository.removeAndFlush(await this.getPermission(id));
    }

    async getAvailablePermissions(): Promise<AvailablePermissions<string>> {
        let availablePermissions: AvailablePermissions<string> = {};
        if (this.config.getAvailablePermissions) {
            availablePermissions = (await this.config.getAvailablePermissions()) as AvailablePermissions<string>;
        }
        return availablePermissions;
    }

    async getPermissions(userId: string): Promise<UserPermission[]> {
        const availablePermissionNames = await this.getAvailablePermissionNames();

        const permissions = (
            await this.permissionRepository.find({
                $and: [{ userId }, { permission: { $in: availablePermissionNames } }],
            })
        ).map((p) => {
            p.source = UserPermissionSource.MANUAL;
            return p;
        });

        if (this.config.getPermissions) {
            const user = await this.getUser(userId);
            if (user) {
                let permissionsByRule = await this.config.getPermissions(user);
                if (permissionsByRule === USERMANAGEMENT.allPermissions) {
                    permissionsByRule = availablePermissionNames.map((permission) => ({ permission }));
                }
                for (const p of permissionsByRule) {
                    const permission = new UserPermission();
                    permission.id = getUuid(JSON.stringify(p));
                    permission.source = UserPermissionSource.BY_RULE;
                    permission.userId = userId;
                    permission.assign({
                        permission: p.permission,
                        configuration: p.configuration,
                        validFrom: p.validFrom,
                        validTo: p.validTo,
                        reason: p.reason,
                        requestedBy: p.requestedBy,
                        approvedBy: p.approvedBy,
                    });
                    permissions.push(permission);
                }
            }
        }

        return permissions.sort((a, b) => availablePermissionNames.indexOf(a.permission) - availablePermissionNames.indexOf(b.permission));
    }

    async getAvailableContentScopes(): Promise<Record<string, AvailableContentScope>> {
        return this.config.getAvailableContentScopes
            ? ((await this.config.getAvailableContentScopes()) as Record<string, AvailableContentScope>)
            : {};
    }

    async getContentScopes(userId: string, skipManual = false): Promise<UserContentScope[]> {
        const availableContentScopes = await this.getAvailableContentScopes();
        const ret: UserContentScope[] = [];
        if (this.config.getContentScopes) {
            const user = await this.getUser(userId);
            if (user) {
                const contentScopes = await this.config.getContentScopes(user);
                if (contentScopes === USERMANAGEMENT.allContentScopes) {
                    for (const scope of Object.keys(availableContentScopes)) {
                        ret.push({
                            scope: scope,
                            values: availableContentScopes[scope].values.map((v) => v.value),
                        });
                    }
                } else {
                    for (const scope of Object.keys(contentScopes)) {
                        ret.push({
                            scope: scope,
                            values: contentScopes[scope as keyof typeof contentScopes],
                        });
                    }
                }
            }
        }
        if (!skipManual) {
            const contentScope = await this.contentScopeRepository.findOne({ userId });
            if (contentScope) {
                for (const scope of contentScope.scopes) {
                    const currentScope = ret.find((s) => s.scope === scope.scope);
                    if (currentScope) {
                        currentScope.values = currentScope.values.concat(scope.values);
                    } else {
                        ret.push(scope);
                    }
                }
            }
        }
        for (const scope of ret) {
            const availableValues = availableContentScopes[scope.scope].values.map((v) => v.value);
            // Make values unique
            scope.values = [...new Set(scope.values)];
            // Allow only values that are defined in availableContentScopes
            scope.values = scope.values.filter((value) => availableValues.includes(value));
            // Order by availableContentScopes
            scope.values.sort((a, b) => availableValues.indexOf(a) - availableValues.indexOf(b));
        }
        // Order scopes by availableContentScopes
        ret.sort((a, b) => Object.keys(availableContentScopes).indexOf(a.scope) - Object.keys(availableContentScopes).indexOf(b.scope));

        return ret;
    }

    async createCurrentUser(user: User): Promise<CurrentUser> {
        const availableContentScopes = await this.getAvailableContentScopes();

        const createCurrentUserContentScopes = (contentScopes: UserContentScope[]): CurrentUserContentScope[] =>
            contentScopes.map((cs) => ({
                scope: cs.scope,
                label: availableContentScopes[cs.scope].label,
                values: cs.values.map((value) => ({
                    label: availableContentScopes[cs.scope].values.find((v) => v.value === value)?.label ?? "",
                    value,
                })),
            }));

        const currentUser = new CurrentUser();
        Object.assign(currentUser, {
            id: user.id,
            name: user.name,
            email: user.email ?? "",
            language: user.language,
            permissions: (await this.getPermissions(user.id)).map((p) => ({
                name: p.permission,
                configuration: p.configuration,
                overrideContentScopes: p.overrideContentScopes,
                contentScopes: p.overrideContentScopes ? createCurrentUserContentScopes(p.contentScopes) : [],
            })),
            contentScopes: createCurrentUserContentScopes(await this.getContentScopes(user.id)),
        });
        return currentUser;
    }
}
