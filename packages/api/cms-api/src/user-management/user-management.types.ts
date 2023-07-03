import { ContentScope } from "../common/decorators/content-scope.interface";

export type PermissionConfiguration = Record<string, unknown>;

export enum USERMANAGEMENT {
    userManagement = "userManagement",
    pageTree = "pageTree",
    dam = "dam",
    allContentScopes = "all-content-scopes",
    allPermissions = "all-permissions",
}

export type Permission<PermissionKeys> = {
    permission: PermissionKeys;
    configuration?: PermissionConfiguration;
    validFrom?: Date;
    validTo?: Date;
    reason?: string;
    requestedBy?: string;
    approvedBy?: string;
};

export type Permissions<PermissionKeys> = Permission<PermissionKeys>[];

export type AvailablePermissions<T extends string> = Record<T, AvailablePermission>;

export type AvailablePermission = {
    name: string;
    description?: string;
};

export type AvailableContentScopes = {
    [key in keyof ContentScope]: AvailableContentScope<ContentScope[key]>;
};

export type ContentScopes =
    | {
          [key in keyof ContentScope]: Array<ContentScope[key]>;
      }
    | typeof USERMANAGEMENT.allContentScopes;

export type AvailableContentScope<T extends string = string> = {
    label: string;
    values: Array<{
        label: string;
        value: T;
    }>;
};

export const USER_MODULE_CONFIG = "user-module-config";
