import type { CurrentUser } from "../user-permissions/dto/current-user";
import type { AccessControlServiceInterface } from "../user-permissions/user-permissions.types";
import type { DamScopeInterface } from "./types";

interface IsAllowedToAccessScopeOptions {
    accessControlService: AccessControlServiceInterface | undefined;
    disableScopeAccessControl: boolean | undefined;
    user: CurrentUser;
    scope: DamScopeInterface | undefined;
}

export function isAllowedToAccessScope({ accessControlService, disableScopeAccessControl, user, scope }: IsAllowedToAccessScopeOptions): boolean {
    if (disableScopeAccessControl) {
        return true;
    }

    if (!accessControlService) {
        // Fail closed: without an access control service and without explicitly disabling the check, access is denied.
        return false;
    }

    return accessControlService.isAllowed(user, "dam", scope);
}
