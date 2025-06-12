import { DiscoveryService } from "@golevelup/nestjs-discovery";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Inject, Injectable, Optional } from "@nestjs/common";
import { isFuture, isPast } from "date-fns";
import { Request } from "express";
import isEqual from "lodash.isequal";
import getUuid from "uuid-by-string";

import { AbstractAccessControlService } from "./access-control.service";
import { DisablePermissionCheck, RequiredPermissionMetadata } from "./decorators/required-permission.decorator";
import { CurrentUser, CurrentUserPermission } from "./dto/current-user";
import { FindUsersArgs } from "./dto/paginated-user-list";
import { UserContentScopes } from "./entities/user-content-scopes.entity";
import { UserPermission, UserPermissionSource } from "./entities/user-permission.entity";
import { ContentScope } from "./interfaces/content-scope.interface";
import { User } from "./interfaces/user";
import { ACCESS_CONTROL_SERVICE, USER_PERMISSIONS_OPTIONS, USER_PERMISSIONS_USER_SERVICE } from "./user-permissions.constants";
import {
    AccessControlServiceInterface,
    UserPermissions,
    UserPermissionsOptions,
    UserPermissionsUserServiceInterface,
} from "./user-permissions.types";
import { sortContentScopeKeysAlphabetically } from "./utils/sort-content-scope-keys-alphabetically";

@Injectable()
export class UserPermissionsService {
    constructor(
        @Inject(USER_PERMISSIONS_OPTIONS) private readonly options: UserPermissionsOptions,
        @Inject(USER_PERMISSIONS_USER_SERVICE) @Optional() private readonly userService: UserPermissionsUserServiceInterface | undefined,
        @Inject(ACCESS_CONTROL_SERVICE) private readonly accessControlService: AccessControlServiceInterface,
        @InjectRepository(UserPermission) private readonly permissionRepository: EntityRepository<UserPermission>,
        @InjectRepository(UserContentScopes) private readonly contentScopeRepository: EntityRepository<UserContentScopes>,
        private readonly discoveryService: DiscoveryService,
    ) {}

    private manualPermissions: { userId: string; permission: string }[] | undefined;
    private availablePermissions: string[] | undefined;

    async getAvailableContentScopes(): Promise<ContentScope[]> {
        if (this.options.availableContentScopes) {
            if (typeof this.options.availableContentScopes === "function") {
                return this.options.availableContentScopes();
            }
            return this.options.availableContentScopes.map((cs) => sortContentScopeKeysAlphabetically(cs));
        }
        return [];
    }

    async getAvailablePermissions(): Promise<string[]> {
        if (this.availablePermissions === undefined) {
            this.availablePermissions = [
                ...new Set(
                    [
                        ...(await this.discoveryService.providerMethodsWithMetaAtKey<RequiredPermissionMetadata>("requiredPermission")),
                        ...(await this.discoveryService.providersWithMetaAtKey<RequiredPermissionMetadata>("requiredPermission")),
                        ...(await this.discoveryService.controllerMethodsWithMetaAtKey<RequiredPermissionMetadata>("requiredPermission")),
                        ...(await this.discoveryService.controllersWithMetaAtKey<RequiredPermissionMetadata>("requiredPermission")),
                    ]
                        .flatMap((p) => p.meta.requiredPermission)
                        .concat(["prelogin"]) // Add permission to allow checking if a specific user has access to a site where preloginEnabled is true
                        .concat(["impersonation"])
                        .filter((p) => p !== DisablePermissionCheck)
                        .sort(),
                ),
            ];
        }
        return this.availablePermissions;
    }

    getUserService(): UserPermissionsUserServiceInterface | undefined {
        return this.userService;
    }

    async getUser(id: string): Promise<User> {
        if (!this.userService) throw new Error("For this functionality you need to define the userService in the UserPermissionsModule.");
        return this.userService.getUser(id);
    }

    async findUsers(args: FindUsersArgs): Promise<[User[], number]> {
        if (!this.userService) throw new Error("For this functionality you need to define the userService in the UserPermissionsModule.");
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

    async hasPermission(user: User, permission: string, refreshCache = true): Promise<boolean> {
        const availablePermissions = await this.getAvailablePermissions();
        if (this.accessControlService.getPermissionsForUser) {
            const permissionsByRule = await this.accessControlService.getPermissionsForUser(user, availablePermissions);
            if (permissionsByRule === UserPermissions.allPermissions) return true;
            if (permissionsByRule.some((p) => p.permission === permission)) return true;
        }
        if (this.manualPermissions === undefined || refreshCache) {
            this.manualPermissions = (await this.permissionRepository.find({ permission: { $in: availablePermissions } }))
                .filter((p) => (!p.validFrom || isPast(p.validFrom)) && (!p.validTo || isFuture(p.validTo)))
                .map((p) => ({ userId: p.userId, permission: p.permission }));
        }
        if (this.manualPermissions.some((p) => p.userId === user.id && p.permission === permission)) return true;

        return false;
    }

    async getPermissions(user: User): Promise<UserPermission[]> {
        const availablePermissions = await this.getAvailablePermissions();
        const permissions = (
            await this.permissionRepository.find({
                $and: [{ userId: user.id }, { permission: { $in: availablePermissions } }],
            })
        ).map((p) => {
            p.source = UserPermissionSource.MANUAL;
            return p;
        });
        if (this.accessControlService.getPermissionsForUser) {
            if (user) {
                let permissionsByRule = await this.accessControlService.getPermissionsForUser(user, availablePermissions);
                if (permissionsByRule === UserPermissions.allPermissions) {
                    permissionsByRule = availablePermissions.map((permission) => ({ permission }));
                }
                for (const p of permissionsByRule) {
                    const permission = new UserPermission();
                    permission.id = getUuid(JSON.stringify(p));
                    permission.source = UserPermissionSource.BY_RULE;
                    permission.userId = user.id;
                    permission.overrideContentScopes = !!p.contentScopes;
                    permission.assign(p);
                    permissions.push(permission);
                }
            }
        }

        return permissions
            .filter((value) => availablePermissions.some((p) => p === value.permission)) // Filter out permissions that are not defined in availablePermissions (e.g. outdated database entries)
            .sort((a, b) => availablePermissions.indexOf(a.permission) - availablePermissions.indexOf(b.permission));
    }

    async getContentScopes(user: User, includeContentScopesManual = true): Promise<ContentScope[]> {
        const contentScopes: ContentScope[] = [];
        const availableContentScopes = await this.getAvailableContentScopes();

        if (this.accessControlService.getContentScopesForUser) {
            const userContentScopes = await this.accessControlService.getContentScopesForUser(user);
            if (userContentScopes === UserPermissions.allContentScopes) {
                contentScopes.push(...availableContentScopes);
            } else {
                contentScopes.push(...userContentScopes);
            }
        }

        if (includeContentScopesManual) {
            const entity = await this.contentScopeRepository.findOne({ userId: user.id });
            if (entity) {
                contentScopes.push(...entity.contentScopes.filter((value) => availableContentScopes.some((cs) => isEqual(cs, value))));
            }
        }

        return contentScopes.map((cs) => sortContentScopeKeysAlphabetically(cs));
    }

    normalizeContentScopes(contentScopes: ContentScope[], availableContentScopes: ContentScope[]): ContentScope[] {
        return [...new Set(contentScopes.map((cs) => JSON.stringify(cs)))] // Make values unique
            .map((cs) => JSON.parse(cs))
            .sort((a, b) => availableContentScopes.indexOf(a) - availableContentScopes.indexOf(b)); // Order by availableContentScopes
    }

    async getImpersonatedUser(authenticatedUser: User, request: Request): Promise<User | undefined> {
        if (request?.cookies["comet-impersonate-user-id"]) {
            const permissions = await this.getPermissions(authenticatedUser);
            if (permissions.find((permission) => permission.permission === "impersonation")) {
                try {
                    const user = await this.getUser(request?.cookies["comet-impersonate-user-id"]);
                    if (
                        await AbstractAccessControlService.isEqualOrMorePermissions(
                            await this.getPermissionsAndContentScopes(authenticatedUser),
                            await this.getPermissionsAndContentScopes(user),
                        )
                    ) {
                        return user;
                    }
                } catch {
                    return undefined;
                }
            }
        }
    }

    async createCurrentUser(authenticatedUser: User, request?: Request): Promise<CurrentUser> {
        const impersonatedUser = request && (await this.getImpersonatedUser(authenticatedUser, request));
        const user = impersonatedUser || authenticatedUser;

        return {
            ...user,
            permissions: await this.getPermissionsAndContentScopes(user),
            impersonated: !!impersonatedUser,
            authenticatedUser: impersonatedUser ? authenticatedUser : undefined,
        };
    }

    async getPermissionsAndContentScopes(user: User): Promise<CurrentUserPermission[]> {
        const availableContentScopes = await this.getAvailableContentScopes();
        const userContentScopes = await this.getContentScopes(user);
        return (await this.getPermissions(user))
            .filter((p) => (!p.validFrom || isPast(p.validFrom)) && (!p.validTo || isFuture(p.validTo)))
            .reduce((acc: CurrentUser["permissions"], userPermission) => {
                const contentScopes = userPermission.overrideContentScopes ? userPermission.contentScopes : userContentScopes;
                const existingPermission = acc.find((p) => p.permission === userPermission.permission);
                if (existingPermission) {
                    existingPermission.contentScopes = [...existingPermission.contentScopes, ...contentScopes];
                } else {
                    acc.push({
                        permission: userPermission.permission,
                        contentScopes,
                    });
                }
                return acc;
            }, [])
            .map((p) => {
                p.contentScopes = this.normalizeContentScopes(p.contentScopes, availableContentScopes);
                return p;
            });
    }
}
