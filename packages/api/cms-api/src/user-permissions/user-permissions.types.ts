import { FindUsersArgs } from "./dto/paginated-user-list";
import { User } from "./dto/user";
import { UserPermission } from "./entities/user-permission.entity";
import { ContentScope } from "./interfaces/content-scope.interface";
import { Permission } from "./interfaces/user-permission.interface";

export type PermissionConfiguration = Record<string, unknown>;

export enum USERPERMISSIONS {
    allContentScopes = "all-content-scopes",
    allPermissions = "all-permissions",
}

type UserPermissions =
    | Pick<UserPermission, "permission" | "configuration" | "validFrom" | "validTo" | "reason" | "requestedBy" | "approvedBy">[]
    | USERPERMISSIONS.allPermissions;

export type ContentScopeValues = {
    [key in keyof ContentScope]: ContentScope[key][];
};

export type UserContentScopes = ContentScopeValues | USERPERMISSIONS.allContentScopes;

export const USERPERMISSIONS_CONFIG = "userpermissions-config";
export const USERPERMISSIONS_CONFIG_SERVICE = "userpermissions-config-service";
export const ACCESS_CONTROL_SERVICE = "access-control-service";

export interface UserPermissionConfigInterface {
    getUser: (id: string) => Promise<User> | User;
    findUsers: (args: FindUsersArgs) => Promise<[User[], number]> | [User[], number];
    getAvailablePermissions?: () => Promise<Permission> | Permission;
    getAvailableContentScopes?: () => Promise<ContentScopeValues> | ContentScopeValues;
    getPermissionsForUser?: (user: User) => Promise<UserPermissions> | UserPermissions;
    getContentScopesForUser?: (user: User) => Promise<UserContentScopes> | UserContentScopes;
}
