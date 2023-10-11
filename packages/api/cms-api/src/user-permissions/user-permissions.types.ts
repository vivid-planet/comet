import { ModuleMetadata, Type } from "@nestjs/common";

import { FindUsersArgs } from "./dto/paginated-user-list";
import { User } from "./dto/user";
import { UserPermission } from "./entities/user-permission.entity";
import { ContentScope } from "./interfaces/content-scope.interface";
import { Permission } from "./interfaces/user-permission.interface";

export enum UserPermissions {
    allContentScopes = "all-content-scopes",
    allPermissions = "all-permissions",
}

export type Users = [User[], number];

export type PermissionsForUser =
    | Pick<UserPermission, "permission" | "validFrom" | "validTo" | "reason" | "requestedBy" | "approvedBy">[]
    | UserPermissions.allPermissions;

export type ContentScopesForUser = ContentScope[] | UserPermissions.allContentScopes;

export interface UserPermissionsOptions {
    availablePermissions?: (keyof Permission)[];
    availableContentScopes?: ContentScope[];
}

export interface UserPermissionsUserService {
    getUser: (id: string) => Promise<User> | User;
    findUsers: (args: FindUsersArgs) => Promise<Users> | Users;
    getPermissionsForUser?: (user: User) => Promise<PermissionsForUser> | PermissionsForUser;
    getContentScopesForUser?: (user: User) => Promise<ContentScopesForUser> | ContentScopesForUser;
}

export interface OptionsFactory<T> {
    createOptions(): Promise<T> | T;
}

export interface AsyncOptions<T> extends Pick<ModuleMetadata, "imports"> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
    useExisting?: Type<T>;
    useClass?: Type<T>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory?: (...args: any[]) => Promise<T> | T;
}
