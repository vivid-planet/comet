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
                    permission.id = getUuid(JSON.stringify(p));
                    permission.source = UserPermissionSource.BY_RULE;
                    permission.userId = userId;
                    permission.overrideContentScopes = !!p.contentScopes;
                    permission.assign(p);
                    permissions.push(permission);
                }
            }
        }

        return permissions
            .filter((value) => availablePermissions.some((p) => p === value.permission))
            .sort(
                (a, b) =>
                    availablePermissions.indexOf(a.permission as keyof Permission) - availablePermissions.indexOf(b.permission as keyof Permission),
            );
    }

    async getContentScopes(userId: string, includeContentScopesManual = true): Promise<ContentScope[]> {
        const contentScopes: ContentScope[] = [];

        const availableContentScopes = await this.getAvailableContentScopes();

        if (this.accessControlService.getContentScopesForUser) {
            const user = await this.getUser(userId);
            if (user) {
                const userContentScopes = await this.accessControlService.getContentScopesForUser(user);
                if (userContentScopes === UserPermissions.allContentScopes) {
                    contentScopes.push(...availableContentScopes);
                } else {
                    contentScopes.push(...userContentScopes);
                }
            }
        }

        if (includeContentScopesManual) {
            const entity = await this.contentScopeRepository.findOne({ userId });
            if (entity) {
                contentScopes.push(...entity.contentScopes);
            }
        }

        return this.normalizeContentScopes(contentScopes, availableContentScopes);
    }

    private normalizeContentScopes(contentScopes: ContentScope[], availableContentScopes: ContentScope[]): ContentScope[] {
        return [...new Set(contentScopes.map((cs) => JSON.stringify(cs)))] // Make values unique
            .map((cs) => JSON.parse(cs))
            .filter((value) => availableContentScopes.some((cs) => isEqual(cs, value))) // Allow only values that are defined in availableContentScopes
            .sort((a, b) => availableContentScopes.indexOf(a) - availableContentScopes.indexOf(b)); // Order by availableContentScopes
    }

    async createCurrentUser(user: User): Promise<CurrentUser> {
        const allContentScopes = await this.getAvailableContentScopes();

        const userContentScopes = await this.getContentScopes(user.id);
        const permissions = (await this.getPermissions(user.id))
            .filter(
                (p) =>
                    (!p.validFrom || differenceInDays(new Date(), p.validFrom) >= 0) && (!p.validTo || differenceInDays(p.validTo, new Date()) >= 0),
            )
            .reduce((acc: CurrentUser["permissions"], userPermission) => {
                const contentScopes = userPermission.overrideContentScopes ? userPermission.contentScopes : userContentScopes;

                const existingPermission = acc.find((p) => p.permission === userPermission.permission);
                if (existingPermission) {
                    existingPermission.contentScopes = this.normalizeContentScopes(
                        [...existingPermission.contentScopes, ...contentScopes],
                        allContentScopes,
                    );
                } else {
                    acc.push({
                        permission: userPermission.permission,
                        contentScopes,
                    });
                }
                return acc;
            }, []);

        const currentUser = new CurrentUser();
        return Object.assign(currentUser, {
            id: user.id,
            name: user.name,
            email: user.email ?? "",
            language: user.language,
            permissions,
        });
    }
}
