import { ModuleMetadata, Type } from "@nestjs/common";

import { AccessControlService } from "./access-control.service";
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
    userService: UserPermissionsUserService;
    accessControlService?: AccessControlService;
}

export interface UserPermissionsUserService {
    getUser: (id: string) => Promise<User> | User;
    findUsers: (args: FindUsersArgs) => Promise<Users> | Users;
    getPermissionsForUser?: (user: User) => Promise<PermissionsForUser> | PermissionsForUser;
    getContentScopesForUser?: (user: User) => Promise<ContentScopesForUser> | ContentScopesForUser;
}

export interface UserPermissionsOptionsFactory {
    createUserPermissionsOptions(): Promise<UserPermissionsOptions> | UserPermissionsOptions;
}

export interface UserPermissionsAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
    useExisting?: Type<UserPermissionsOptionsFactory>;
    useClass?: Type<UserPermissionsOptionsFactory>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory?: (...args: any[]) => Promise<UserPermissionsOptions> | UserPermissionsOptions;
}
