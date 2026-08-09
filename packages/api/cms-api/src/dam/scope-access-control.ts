import type { CurrentUser } from "../user-permissions/dto/current-user";
import type { AccessControlServiceInterface } from "../user-permissions/user-permissions.types";
import type { DamScopeInterface } from "./types";

/**
 * The DAM checks scope access through the `AccessControlService` provided by `UserPermissionsModule`. Without that service, its REST
 * endpoints deny every scoped request and its GraphQL resolvers lose the guard that enforces `@RequiredPermission` — so the DAM refuses
 * to start rather than run half-protected. Opting out with `disableScopeAccessControl` puts that responsibility on the application.
 */
export function assertScopeAccessControlIsConfigured({
    accessControlService,
    disableScopeAccessControl,
}: {
    accessControlService: AccessControlServiceInterface | undefined;
    disableScopeAccessControl: boolean | undefined;
}): void {
    if (disableScopeAccessControl) {
        return;
    }

    if (!accessControlService) {
        throw new Error(
            "DamFilesModule: no AccessControlService is available, so the DAM cannot check who may access a scope. Register UserPermissionsModule, or pass disableScopeAccessControl: true to run the DAM behind your own authentication guard.",
        );
    }
}

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
