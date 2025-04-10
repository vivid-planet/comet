import { DiscoveryService } from "@golevelup/nestjs-discovery";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Inject, Injectable, Optional } from "@nestjs/common";
import { isFuture, isPast } from "date-fns";
import { Request } from "express";
import isEqual from "lodash.isequal";
import getUuid from "uuid-by-string";

import { DisablePermissionCheck, RequiredPermissionMetadata } from "./decorators/required-permission.decorator";
import { ContentScopeWithLabel } from "./dto/content-scope";
import { CurrentUser, CurrentUserPermission } from "./dto/current-user";
import { FindUsersArgs } from "./dto/paginated-user-list";
import { UserContentScopes } from "./entities/user-content-scopes.entity";
import { UserPermission, UserPermissionSource } from "./entities/user-permission.entity";
import { ContentScope } from "./interfaces/content-scope.interface";
import { User } from "./interfaces/user";
import { ACCESS_CONTROL_SERVICE, USER_PERMISSIONS_OPTIONS, USER_PERMISSIONS_USER_SERVICE } from "./user-permissions.constants";
import {
    AccessControlServiceInterface,
    AvailableContentScope,
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

    async getAvailableContentScopes(): Promise<ContentScopeWithLabel[]> {
        let contentScopes: AvailableContentScope[] = [];
        if (this.options.availableContentScopes) {
            if (typeof this.options.availableContentScopes === "function") {
                contentScopes = await this.options.availableContentScopes();
            } else {
                contentScopes = this.options.availableContentScopes;
            }
        }

        function camelCaseToHumanReadable(s: string | number) {
            const words = s.toString().match(/[A-Za-z0-9][a-z0-9]*/g) || [];
            return words.map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(" ");
        }

        return contentScopes
            .map((contentScope) =>
                "scope" in contentScope
                    ? contentScope
                    : {
                          scope: contentScope,
                      },
            )
            .map((contentScope) => ({
                scope: contentScope.scope,
                label: Object.fromEntries(
                    Object.entries(contentScope.scope).map(([key, value]) => [
                        key,
                        contentScope.label && key in contentScope.label
                            ? (contentScope.label as Record<string, string>)[key]
                            : camelCaseToHumanReadable(value),
                    ]),
                ),
            }));

        // TODO contentScopes = contentScopes.map((cs) => sortContentScopeKeysAlphabetically(cs));
        // TODO make unique
    }

    async getAvailablePermissions(): Promise<string[]> {
        return [
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

    async checkContentScopes(contentScopes: ContentScopeWithLabel[]): Promise<void> {
        const availableContentScopes = await this.getAvailableContentScopes();
        contentScopes.forEach((scope) => {
            if (!availableContentScopes.some((cs) => isEqual(cs, scope))) {
                throw new Error(`ContentScope does not exist: ${JSON.stringify(scope.scope)}.`);
            }
        });
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
        const availableContentScopes = (await this.getAvailableContentScopes()).map((cs) => cs.scope);

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

    async getImpersonatedUser(authenticatedUser: User, request: Request): Promise<User | undefined> {
        if (request?.cookies["comet-impersonate-user-id"]) {
            const permissions = await this.getPermissions(authenticatedUser);
            if (permissions.find((permission) => permission.permission === "impersonation")) {
                try {
                    return await this.getUser(request?.cookies["comet-impersonate-user-id"]);
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
            }, []);
    }
}
