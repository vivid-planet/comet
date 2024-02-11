import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { isFuture, isPast } from "date-fns";
import isEqual from "lodash.isequal";
import getUuid from "uuid-by-string";

import { CurrentUser } from "./dto/current-user";
import { FindUsersArgs } from "./dto/paginated-user-list";
import { User } from "./dto/user";
import { UserContentScopes } from "./entities/user-content-scopes.entity";
import { UserPermission, UserPermissionSource } from "./entities/user-permission.entity";
import { ContentScope } from "./interfaces/content-scope.interface";
import { Permission } from "./interfaces/user-permission.interface";
import { ACCESS_CONTROL_SERVICE, USER_PERMISSIONS_OPTIONS, USER_PERMISSIONS_USER_SERVICE } from "./user-permissions.constants";
import {
    AccessControlServiceInterface,
    UserPermissions,
    UserPermissionsOptions,
    UserPermissionsUserServiceInterface,
} from "./user-permissions.types";

@Injectable()
export class UserPermissionsService {
    constructor(
        @Inject(USER_PERMISSIONS_OPTIONS) private readonly options: UserPermissionsOptions,
        @Inject(USER_PERMISSIONS_USER_SERVICE) private readonly userService: UserPermissionsUserServiceInterface,
        @Inject(ACCESS_CONTROL_SERVICE) private readonly accessControlService: AccessControlServiceInterface,
        @InjectRepository(UserPermission) private readonly permissionRepository: EntityRepository<UserPermission>,
        @InjectRepository(UserContentScopes) private readonly contentScopeRepository: EntityRepository<UserContentScopes>,
    ) {}

    async getAvailableContentScopes(): Promise<ContentScope[]> {
        return this.options.availableContentScopes ?? [];
    }

    async getAvailablePermissions(): Promise<(keyof Permission)[]> {
        return [
            ...new Set<keyof Permission>(["dam", "pageTree", "userPermissions", "cronJobs", "builds", ...(this.options.availablePermissions ?? [])]),
        ];
    }

    async getUser(id: string): Promise<User> {
        return this.userService.getUser(id);
    }

    async findUsers(args: FindUsersArgs): Promise<[User[], number]> {
        return this.userService.findUsers(args);
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
        if (this.accessControlService.getPermissionsForUser) {
            const user = await this.getUser(userId);
            if (user) {
                let permissionsByRule = await this.accessControlService.getPermissionsForUser(user);
                if (permissionsByRule === UserPermissions.allPermissions) {
                    permissionsByRule = availablePermissions.map((permission) => ({ permission }));
                }
                for (const p of permissionsByRule) {
                    const permission = new UserPermission();
                    permission.assign({
                        id: getUuid(JSON.stringify(p)),
                        ...p,
                        overrideContentScopes: !!p.contentScopes,
                        source: UserPermissionSource.BY_RULE,
                        userId,
                        permission: typeof p.permission === "string" ? p.permission : p.permission.permission,
                        configuration: typeof p.permission === "string" ? null : p.permission.configuration,
                    });
                    permissions.push(permission);
                }
            }
        }

        return permissions
            .filter((value) => availablePermissions.some((p) => p === value.permission)) // Filter out permissions that are not defined in availablePermissions (e.g. outdated database entries)
            .sort(
                (a, b) =>
                    availablePermissions.indexOf(a.permission as keyof Permission) - availablePermissions.indexOf(b.permission as keyof Permission),
            );
    }

    async getContentScopes(userId: string, includeContentScopesManual = true): Promise<ContentScope[] | UserPermissions.allContentScopes> {
        const contentScopes: ContentScope[] = [];

        if (this.accessControlService.getContentScopesForUser) {
            const user = await this.getUser(userId);
            if (user) {
                const userContentScopes = await this.accessControlService.getContentScopesForUser(user);
                if (userContentScopes === UserPermissions.allContentScopes) {
                    return UserPermissions.allContentScopes;
                } else {
                    contentScopes.push(...userContentScopes);
                }
            }
        }

        if (includeContentScopesManual) {
            const entity = await this.contentScopeRepository.findOne({ userId });
            if (entity) {
                const availableContentScopes = await this.getAvailableContentScopes();
                contentScopes.push(...entity.contentScopes.filter((value) => availableContentScopes.some((cs) => isEqual(cs, value))));
            }
        }

        return contentScopes;
    }

    normalizeContentScopes(contentScopes: ContentScope[], availableContentScopes: ContentScope[]): ContentScope[] {
        return [...new Set(contentScopes.map((cs) => JSON.stringify(cs)))] // Make values unique
            .map((cs) => JSON.parse(cs))
            .sort((a, b) => availableContentScopes.indexOf(a) - availableContentScopes.indexOf(b)); // Order by availableContentScopes
    }

    async createCurrentUser(user: User): Promise<CurrentUser> {
        const availableContentScopes = await this.getAvailableContentScopes();
        const userContentScopes = await this.getContentScopes(user.id);
        const contentScopes =
            userContentScopes === UserPermissions.allContentScopes ? null : this.normalizeContentScopes(userContentScopes, availableContentScopes);
        const userPermissions = (await this.getPermissions(user.id)).filter(
            (p) => (!p.validFrom || isPast(p.validFrom)) && (!p.validTo || isFuture(p.validTo)),
        );
        const permissions = userPermissions
            .reduce((acc: CurrentUser["permissions"], userPermission) => {
                const contentScopes = userPermission.overrideContentScopes ? userPermission.contentScopes : null;
                const existingPermission = acc.find((p) => p.permission === userPermission.permission);
                if (existingPermission) {
                    if (contentScopes === null || existingPermission.contentScopes === null) {
                        existingPermission.contentScopes = null;
                    } else {
                        existingPermission.contentScopes = [...existingPermission.contentScopes, ...contentScopes];
                    }
                    if (userPermission.configuration) {
                        existingPermission.configuration = { ...existingPermission.configuration, ...userPermission.configuration };
                    }
                } else {
                    acc.push({
                        permission: userPermission.permission,
                        configuration: userPermission.configuration,
                        contentScopes,
                    });
                }
                return acc;
            }, [])
            .map((p) => {
                p.contentScopes = p.contentScopes ? this.normalizeContentScopes(p.contentScopes, availableContentScopes) : null;
                return p;
            });

        const currentUser = new CurrentUser();
        return Object.assign(currentUser, {
            id: user.id,
            name: user.name,
            email: user.email ?? "",
            language: user.language,
            contentScopes,
            permissions,
        });
    }
}
