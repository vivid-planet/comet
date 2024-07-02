import { DiscoveryService } from "@golevelup/nestjs-discovery";
import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable, Optional } from "@nestjs/common";
import { isFuture, isPast } from "date-fns";
import { JwtPayload } from "jsonwebtoken";
import isEqual from "lodash.isequal";
import getUuid from "uuid-by-string";

import { RequiredPermissionMetadata } from "./decorators/required-permission.decorator";
import { CurrentUser } from "./dto/current-user";
import { FindUsersArgs } from "./dto/paginated-user-list";
import { Permission } from "./dto/permission";
import { UserContentScopes } from "./entities/user-content-scopes.entity";
import { UserPermission, UserPermissionSource } from "./entities/user-permission.entity";
import { ContentScope } from "./interfaces/content-scope.interface";
import { User } from "./interfaces/user";
import { ACCESS_CONTROL_SERVICE, USER_PERMISSIONS_OPTIONS, USER_PERMISSIONS_USER_SERVICE } from "./user-permissions.constants";
import {
    AccessControlServiceInterface,
    PermissionConfiguration,
    UserPermissions,
    UserPermissionsOptions,
    UserPermissionsUserServiceInterface,
} from "./user-permissions.types";

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

    public static parsePermission(permission: string | Permission): Permission {
        if (typeof permission !== "string") return permission;

        if (permission.indexOf(".") > 0) {
            return {
                permission: permission.split(".")[0],
                configuration: { [permission.split(".")[1]]: true },
            };
        } else {
            return {
                permission,
            };
        }
    }

    async getAvailableContentScopes(): Promise<ContentScope[]> {
        if (this.options.availableContentScopes) {
            if (typeof this.options.availableContentScopes === "function") {
                return this.options.availableContentScopes();
            }
            return this.options.availableContentScopes;
        }
        return [];
    }

    async getAvailablePermissions(): Promise<Permission[]> {
        return [
            ...(await this.discoveryService.providerMethodsWithMetaAtKey<RequiredPermissionMetadata>("requiredPermission")),
            ...(await this.discoveryService.providersWithMetaAtKey<RequiredPermissionMetadata>("requiredPermission")),
            ...(await this.discoveryService.controllerMethodsWithMetaAtKey<RequiredPermissionMetadata>("requiredPermission")),
            ...(await this.discoveryService.controllersWithMetaAtKey<RequiredPermissionMetadata>("requiredPermission")),
        ]
            .flatMap((p) => p.meta.requiredPermission)
            .reduce<Permission[]>((permissions, permission) => {
                const existing = permissions.find((p) => p.permission == permission.permission);
                if (existing) {
                    if (permission.configuration) {
                        existing.configuration = Object.assign(existing.configuration || {}, permission.configuration);
                    }
                } else {
                    permissions.push(permission);
                }
                return permissions;
            }, []);
    }

    async createUserFromIdToken(idToken: JwtPayload): Promise<User> {
        if (this.userService?.createUserFromIdToken) return this.userService.createUserFromIdToken(idToken);
        if (!idToken.sub) throw new Error("JwtPayload does not contain sub.");
        return {
            id: idToken.sub,
            name: idToken.name,
            email: idToken.email,
            language: idToken.locale || idToken.language,
        };
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

    async getPermissions(user: User): Promise<UserPermission[]> {
        const availablePermissions = await this.getAvailablePermissions();
        const permissions = (
            await this.permissionRepository.find({
                $and: [{ userId: user.id }, { permission: { $in: availablePermissions.map((p) => p.permission) } }],
            })
        ).map((p) => {
            p.source = UserPermissionSource.MANUAL;
            return p;
        });
        if (this.accessControlService.getPermissionsForUser) {
            if (user) {
                let permissionsByRule = await this.accessControlService.getPermissionsForUser(user);
                if (permissionsByRule === UserPermissions.allPermissions) {
                    permissionsByRule = availablePermissions.map((permission) => ({ permission }));
                }
                for (const permission of permissionsByRule) {
                    let permissionName;
                    let permissionConfiguration;
                    if (Array.isArray(permission.permission)) {
                        permissionName = permission.permission.reduce<string>((prev, curr) => {
                            if (typeof curr !== "string") throw new Error(`If passing an array of permissions, only strings are allowed.`);
                            const permission = curr.split(".")[0];
                            if (!permission) throw new Error(`If passing an array of permissions, they must be separated by a dot: e.g. "news.read"`);
                            if (prev && prev !== permission)
                                throw new Error(
                                    `If passing an array of permissions, they all must have the same permission. Currently: ${prev} !== ${curr}`,
                                );
                            return permission;
                        }, "");
                        permissionConfiguration = permission.permission.reduce<PermissionConfiguration>((prev, curr) => {
                            return {
                                ...prev,
                                [curr.split(".")[1]]: true,
                            };
                        }, permissionConfiguration ?? {});
                    } else {
                        const parsedPermission = UserPermissionsService.parsePermission(permission.permission);
                        permissionName = parsedPermission.permission;
                        permissionConfiguration = parsedPermission.configuration;
                    }

                    const userPermission = new UserPermission();
                    userPermission.assign({
                        ...permission,
                        permission: permissionName,
                        configuration: permissionConfiguration,
                        id: getUuid(
                            JSON.stringify({
                                permissionName,
                                permissionConfiguration,
                                permissionContentScopes: permission.contentScopes,
                            }),
                        ),
                        source: UserPermissionSource.BY_RULE,
                        userId: user.id,
                        overrideContentScopes: !!permission.contentScopes,
                    });
                    permissions.push(userPermission);
                }
            }
        }
        return permissions
            .filter((value) => availablePermissions.some((p) => p.permission === value.permission)) // Filter out permissions that are not defined in availablePermissions (e.g. outdated database entries)
            .sort((a, b) => a.permission.localeCompare(b.permission));
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

        return contentScopes;
    }

    normalizeContentScopes(contentScopes: ContentScope[], availableContentScopes: ContentScope[]): ContentScope[] {
        return [...new Set(contentScopes.map((cs) => JSON.stringify(cs)))] // Make values unique
            .map((cs) => JSON.parse(cs))
            .sort((a, b) => availableContentScopes.indexOf(a) - availableContentScopes.indexOf(b)); // Order by availableContentScopes
    }

    async createCurrentUser(user: User): Promise<CurrentUser> {
        const userContentScopes = await this.getContentScopes(user);
        const permissions = (await this.getPermissions(user))
            .filter((p) => (!p.validFrom || isPast(p.validFrom)) && (!p.validTo || isFuture(p.validTo)))
            .map((p) => ({
                permission: p.permission,
                configuration: p.configuration,
                contentScopes: p.overrideContentScopes ? p.contentScopes : userContentScopes,
            }));

        return {
            ...user,
            permissions,
        };
    }
}
