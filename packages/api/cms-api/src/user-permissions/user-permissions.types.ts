import { FindUsersArgs } from "./dto/paginated-user-list";
import { User } from "./dto/user";
import { UserPermission } from "./entities/user-permission.entity";
import { ContentScope } from "./interfaces/content-scope.interface";
import { Permission } from "./interfaces/user-permission.interface";

export type PermissionConfiguration = Record<string, unknown>;

export enum UserPermissions {
    allContentScopes = "all-content-scopes",
    allPermissions = "all-permissions",
}

type Permissions =
    | Pick<UserPermission, "permission" | "configuration" | "validFrom" | "validTo" | "reason" | "requestedBy" | "approvedBy">[]
    | UserPermissions.allPermissions;

export type ContentScopes = ContentScope[] | UserPermissions.allContentScopes;

export interface UserPermissionConfigInterface {
    getUser: (id: string) => Promise<User> | User;
    findUsers: (args: FindUsersArgs) => Promise<[User[], number]> | [User[], number];
    getAvailablePermissions?: () => Promise<Permission> | Permission;
    getAvailableContentScopes?: () => Promise<ContentScope[]> | ContentScope[];
    getPermissionsForUser?: (user: User) => Promise<Permissions> | Permissions;
    getContentScopesForUser?: (user: User) => Promise<ContentScopes> | ContentScopes;
}
