import { type AuthVariables, type CurrentUser, permissionBasedAccessControl } from "@dextinity/cms-hono";
import { createMiddleware } from "hono/factory";
import { timingSafeEqual } from "hono/utils/buffer";

const apiUser: CurrentUser = {
    id: "api-token",
    name: "API Token",
    email: "api-token@example.com",
    permissions: [{ permission: "dam", contentScopes: [{ domain: "main" }, { domain: "secondary" }] }],
};

/**
 * A stand-in for `UserPermissionsModule` and the JWT/oauth2-proxy authentication of the NestJS demo: requests with the API token as
 * bearer token are authenticated as a user with DAM permissions for the demo scopes, all others are anonymous.
 */
export function authentication({ apiToken }: { apiToken: string }) {
    return createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
        const authorization = c.req.header("authorization");
        const token = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : undefined;

        c.set("currentUser", token !== undefined && (await timingSafeEqual(token, apiToken)) ? apiUser : null);
        c.set("accessControl", permissionBasedAccessControl);
        await next();
    });
}
