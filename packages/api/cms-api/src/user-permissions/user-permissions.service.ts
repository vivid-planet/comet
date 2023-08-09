import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import getUuid from "uuid-by-string";

import { CurrentUser } from "./dto/current-user";
import { FindUsersArgs } from "./dto/paginated-user-list";
import { User } from "./dto/user";
import { UserContentScope, UserContentScopes } from "./entities/user-content-scopes.entity";
import { UserPermission, UserPermissionSource } from "./entities/user-permission.entity";
import { AvailableContentScopes } from "./user-content-scopes.resolver";
import { UserPermissionConfigInterface, USERPERMISSIONS, USERPERMISSIONS_CONFIG_SERVICE } from "./user-permissions.types";
import { getDate } from "./utils/getDate";
@Injectable()
export class UserPermissionsService {
    constructor(
        @Inject(USERPERMISSIONS_CONFIG_SERVICE) private readonly service: UserPermissionConfigInterface,
        @InjectRepository(UserPermission) private readonly permissionRepository: EntityRepository<UserPermission>,
        @InjectRepository(UserContentScopes) private readonly contentScopeRepository: EntityRepository<UserContentScopes>,
    ) {}

    async getAvailableContentScopes(): Promise<AvailableContentScopes[]> {
        return this.service.getAvailableContentScopes
            ? Object.entries(this.service.getAvailableContentScopes()).map(([scope, values]) => ({ scope, values }))
            : [];
    }

    async getAvailablePermissions(): Promise<string[]> {
        return [
            "dam",
            "pageTree",
            "userPermissions",
            ...(this.service.getAvailablePermissions ? Object.keys(await this.service.getAvailablePermissions()) : []),
        ];
    }

    async getUser(id: string): Promise<User> {
        return this.service.getUser(id);
    }

    async findUsers(args: FindUsersArgs): Promise<[User[], number]> {
        return this.service.findUsers(args);
    }

    async checkContentScopes(contentScopes: UserContentScope[]): Promise<void> {
        const availableContentScopes = await this.getAvailableContentScopes();
        const allowedScopes = availableContentScopes.map((c) => c.scope);
        contentScopes.forEach((scope) => {
            if (!allowedScopes.includes(scope.scope)) {
                throw new Error(`ContentScope does not exist: ${scope.scope}. Existing scopes: ${allowedScopes.join(", ")}`);
            }
            const allowedValues = availableContentScopes.find((c) => c.scope === scope.scope)?.values ?? [];
            scope.values.forEach((value) => {
                if (!allowedValues.includes(value)) {
                    throw new Error(`ContentScopeValue of ContentScope ${scope.scope} does not exist: ${value}.`);
                }
            });
        });
    }

    async getPermissions(userId: string): Promise<UserPermission[]> {
        const availablePermissions = await this.getAvailablePermissions();
        const permissions = (
            await this.permissionRepository.find({
                $and: [{ userId }, { permission: { $in: availablePermissions } }],
            })
        ).map((p) => {
            p.source = UserPermissionSource.MANUAL;
            return p;
        });
        if (this.service.getPermissionsForUser) {
            const user = await this.getUser(userId);
            if (user) {
                let permissionsByRule = await this.service.getPermissionsForUser(user);
                if (permissionsByRule === USERPERMISSIONS.allPermissions) {
                    permissionsByRule = availablePermissions.map((permission) => ({ permission }));
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

        return permissions.sort((a, b) => availablePermissions.indexOf(a.permission) - availablePermissions.indexOf(b.permission));
    }

    async getContentScopes(userId: string, skipManual = false): Promise<UserContentScope[]> {
        const availableContentScopes = await this.getAvailableContentScopes();
        const ret: UserContentScope[] = [];
        if (this.service.getContentScopesForUser) {
            const user = await this.getUser(userId);
            if (user) {
                const contentScopes = await this.service.getContentScopesForUser(user);
                if (contentScopes === USERPERMISSIONS.allContentScopes) {
                    ret.push(...availableContentScopes);
                } else {
                    for (const [scope, values] of Object.entries(contentScopes)) {
                        ret.push({
                            scope,
                            values: (values as string[]).map((v) => v.toString()),
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
            const allowedValues = availableContentScopes.find((c) => c.scope === scope.scope)?.values ?? [];
            // Make values unique
            scope.values = [...new Set(scope.values)];
            // Allow only values that are defined in availableContentScopes
            scope.values = scope.values.filter((value) => allowedValues.includes(value));
            // Order by availableContentScopes
            scope.values.sort((a, b) => allowedValues.indexOf(a) - allowedValues.indexOf(b));
        }
        // Order scopes by availableContentScopes
        ret.sort((a, b) => Object.keys(availableContentScopes).indexOf(a.scope) - Object.keys(availableContentScopes).indexOf(b.scope));

        return ret;
    }

    async createCurrentUser(user: User): Promise<CurrentUser> {
        const currentUser = new CurrentUser();
        Object.assign(currentUser, {
            id: user.id,
            name: user.name,
            email: user.email ?? "",
            language: user.language,
            permissions: (await this.getPermissions(user.id))
                .filter((p) => (!p.validFrom || getDate(p.validFrom) <= getDate()) && (!p.validTo || getDate(p.validTo) >= getDate()))
                .map((p) => ({
                    // TODO Filter by valid date
                    permission: p.permission,
                    configuration: p.configuration,
                    overrideContentScopes: p.overrideContentScopes,
                    contentScopes: p.overrideContentScopes ? p.contentScopes : [],
                })),
            contentScopes: await this.getContentScopes(user.id),
        });
        return currentUser;
    }
}
