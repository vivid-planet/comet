import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { differenceInDays } from "date-fns";
import isEqual from "lodash.isequal";
import getUuid from "uuid-by-string";

import { CurrentUser } from "./dto/current-user";
import { FindUsersArgs } from "./dto/paginated-user-list";
import { User } from "./dto/user";
import { UserContentScopes } from "./entities/user-content-scopes.entity";
import { UserPermission, UserPermissionSource } from "./entities/user-permission.entity";
import { ContentScope } from "./interfaces/content-scope.interface";
import { Permission } from "./interfaces/user-permission.interface";
import { USER_PERMISSIONS_OPTIONS } from "./user-permissions.constants";
import { UserPermissions, UserPermissionsOptions } from "./user-permissions.types";

@Injectable()
export class UserPermissionsService {
    constructor(
        @Inject(USER_PERMISSIONS_OPTIONS) private readonly options: UserPermissionsOptions,
        @InjectRepository(UserPermission) private readonly permissionRepository: EntityRepository<UserPermission>,
        @InjectRepository(UserContentScopes) private readonly contentScopeRepository: EntityRepository<UserContentScopes>,
    ) {}

    async getAvailableContentScopes(): Promise<ContentScope[]> {
        return this.options.getAvailableContentScopes ? this.options.getAvailableContentScopes() : [];
    }

    async getAvailablePermissions(): Promise<(keyof Permission)[]> {
        return [
            ...new Set<keyof Permission>([
                "dam",
                "pageTree",
                "userPermissions",
                "system",
                ...(this.options.getAvailablePermissions ? await this.options.getAvailablePermissions() : []),
            ]),
        ];
    }

    async getUser(id: string): Promise<User> {
        return this.options.getUser(id);
    }

    async findUsers(args: FindUsersArgs): Promise<[User[], number]> {
        return this.options.findUsers(args);
    }

    async checkContentScopes(contentScopes: ContentScope[]): Promise<void> {
        const availableContentScopes = await this.getAvailableContentScopes();
        contentScopes.forEach((scope) => {
            if (!availableContentScopes.some((cs) => isEqual(cs, scope))) {
                throw new Error(`ContentScope does not exist: ${JSON.stringify(scope)}.`);
            }
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
        if (this.options.getPermissionsForUser) {
            const user = await this.getUser(userId);
            if (user) {
                let permissionsByRule = await this.options.getPermissionsForUser(user);
                if (permissionsByRule === UserPermissions.allPermissions) {
                    permissionsByRule = availablePermissions.map((permission) => ({ permission }));
                }
                for (const p of permissionsByRule) {
                    const permission = new UserPermission();
                    permission.id = getUuid(JSON.stringify(p));
                    permission.source = UserPermissionSource.BY_RULE;
                    permission.userId = userId;
                    permission.assign({
                        permission: p.permission,
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

        return permissions.sort(
            (a, b) => availablePermissions.indexOf(a.permission as keyof Permission) - availablePermissions.indexOf(b.permission as keyof Permission),
        );
    }

    async getContentScopes(userId: string, skipManual = false): Promise<ContentScope[]> {
        const availableContentScopes = await this.getAvailableContentScopes();
        const contentScopes: ContentScope[] = [];
        if (this.options.getContentScopesForUser) {
            const user = await this.getUser(userId);
            if (user) {
                const userContentScopes = await this.options.getContentScopesForUser(user);
                if (userContentScopes === UserPermissions.allContentScopes) {
                    contentScopes.push(...availableContentScopes);
                } else {
                    contentScopes.push(...userContentScopes);
                }
            }
        }
        if (!skipManual) {
            const entity = await this.contentScopeRepository.findOne({ userId });
            if (entity) {
                contentScopes.push(...entity.contentScopes);
            }
        }
        return [...new Set(contentScopes)] // Make values unique
            .filter((value) => availableContentScopes.some((cs) => isEqual(cs, value))) // Allow only values that are defined in availableContentScopes
            .sort((a, b) => availableContentScopes.indexOf(a) - availableContentScopes.indexOf(b)); // Order by availableContentScopes
    }

    async createCurrentUser(user: User): Promise<CurrentUser> {
        const currentUser = new CurrentUser();
        Object.assign(currentUser, {
            id: user.id,
            name: user.name,
            email: user.email ?? "",
            language: user.language,
            contentScopes: await this.getContentScopes(user.id),
            permissions: (await this.getPermissions(user.id))
                .filter(
                    (p) =>
                        (!p.validFrom || differenceInDays(new Date(), p.validFrom) >= 0) &&
                        (!p.validTo || differenceInDays(p.validTo, new Date()) >= 0),
                )
                .map((p) => ({
                    permission: p.permission,
                })),
        });
        return currentUser;
    }
}
