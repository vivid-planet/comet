import { ModuleMetadata, Type } from "@nestjs/common";

import { CurrentUser } from "./dto/current-user";
import { FindUsersArgs } from "./dto/paginated-user-list";
import { UserPermission } from "./entities/user-permission.entity";
import { ContentScope } from "./interfaces/content-scope.interface";
import { User } from "./interfaces/user";

/* eslint-disable @typescript-eslint/naming-convention */
// TODO: Replace with PascalCase
export enum UserPermissions {
    allContentScopes = "all-content-scopes",
    allPermissions = "all-permissions",
}
/* eslint-enable @typescript-eslint/naming-convention */

export type Users = [User[], number];

export type SystemUser = string;

type PermissionForUser = {
    permission: string;
    contentScopes?: ContentScope[];
} & Pick<UserPermission, "validFrom" | "validTo" | "reason" | "requestedBy" | "approvedBy">;
export type PermissionsForUser = PermissionForUser[] | UserPermissions.allPermissions;

export type ContentScopesForUser = ContentScope[] | UserPermissions.allContentScopes;

export interface AccessControlServiceInterface {
    isAllowed(user: CurrentUser | SystemUser, permission: string, contentScope?: ContentScope): boolean;
    getPermissionsForUser?: (user: User) => Promise<PermissionsForUser> | PermissionsForUser;
    getContentScopesForUser?: (user: User) => Promise<ContentScopesForUser> | ContentScopesForUser;
}

export interface UserPermissionsUserServiceInterface {
    getUser: (id: string) => Promise<User> | User;
    findUsers: (args: FindUsersArgs) => Promise<Users> | Users;
}

export interface UserPermissionsOptions {
    availableContentScopes?: ContentScope[] | (() => Promise<ContentScope[]> | ContentScope[]);
    systemUsers?: string[];
}
export interface UserPermissionsModuleSyncOptions extends UserPermissionsOptions {
    UserService?: Type<UserPermissionsUserServiceInterface>;
    AccessControlService: Type<AccessControlServiceInterface>;
}

export interface UserPermissionsAsyncOptions extends UserPermissionsOptions {
    userService?: UserPermissionsUserServiceInterface;
    accessControlService: AccessControlServiceInterface;
}

export interface UserPermissionsOptionsFactory {
    createUserPermissionsOptions(): Promise<UserPermissionsAsyncOptions> | UserPermissionsAsyncOptions;
}

export interface UserPermissionsModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
    useExisting?: Type<UserPermissionsOptionsFactory>;
    useClass?: Type<UserPermissionsOptionsFactory>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory?: (...args: any[]) => Promise<UserPermissionsAsyncOptions> | UserPermissionsAsyncOptions;
}
