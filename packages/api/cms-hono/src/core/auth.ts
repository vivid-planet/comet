import { createMiddleware } from "hono/factory";

import { forbidden, unauthorized } from "./errors.js";
import { inject } from "./provide.js";

export type ContentScope = Record<string, unknown>;

export interface CurrentUserPermission {
    permission: string;
    contentScopes: ContentScope[];
}

export interface CurrentUser {
    id: string;
    name: string;
    email: string;
    permissions: CurrentUserPermission[];
}

export interface AccessControlService {
    isAllowed(user: CurrentUser, permission: string, contentScope?: ContentScope): boolean;
}

export interface AuthVariables {
    currentUser: CurrentUser | null;
    accessControl: AccessControlService;
}

export function isScopeWithin(scope: ContentScope, containingScope: ContentScope): boolean {
    return Object.keys(scope).every((dimension) => {
        const value = scope[dimension];
        const containingValue = containingScope[dimension];
        return containingValue === "*" || containingValue === value || (containingValue == null && value == null);
    });
}

export const permissionBasedAccessControl: AccessControlService = {
    isAllowed(user, permission, contentScope) {
        return user.permissions.some(
            (p) => p.permission === permission && (!contentScope || p.contentScopes.some((cs) => isScopeWithin(contentScope, cs))),
        );
    },
};

/**
 * The counterpart of `@RequiredPermission(..., { skipScopeCheck: true })`: requires an authenticated user with the permission in any
 * scope. Scopes must be checked in the handler with `assertScopeAllowed`, once the scope of the affected entity is known.
 */
export function requirePermission(permission: string) {
    return createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
        const user = inject<CurrentUser | null>(c, "currentUser", "requirePermission");
        if (user === null) {
            throw unauthorized();
        }
        if (!inject<AccessControlService>(c, "accessControl", "requirePermission").isAllowed(user, permission)) {
            throw forbidden();
        }
        await next();
    });
}

export function assertScopeAllowed(
    { currentUser, accessControl }: Pick<AuthVariables, "currentUser" | "accessControl">,
    permission: string,
    scope: ContentScope | undefined,
): void {
    if (currentUser === null || !accessControl.isAllowed(currentUser, permission, scope)) {
        throw forbidden();
    }
}
