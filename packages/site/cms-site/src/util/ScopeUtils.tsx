import { NextRequest } from "next/server";

import { GraphQLFetch } from "../graphQLFetch/graphQLFetch";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Scope = Record<string, any>;

export function getJwtSigningKey() {
    if (!process.env.SITE_JWT_SECRET && process.env.NODE_ENV === "production") {
        throw new Error("SITE_JWT_SECRET environment variable is required in production mode");
    }
    return process.env.SITE_JWT_SECRET || "secret";
}

export async function validateScope(request: NextRequest, graphQLFetch: GraphQLFetch, permission: string, scope: Scope): Promise<boolean> {
    const { currentUser } = await graphQLFetch<{ currentUser: { permissionsForScope: string[] } }, { scope: Scope }>(
        `
            query CurrentUserPermissionsForScope($scope: JSONObject!) {
                currentUser {
                    permissionsForScope(scope: $scope)
                }
            }
        `,
        { scope },
        {
            headers: {
                authorization: request.headers.get("authorization") || "",
            },
        },
    );
    return currentUser.permissionsForScope.includes(permission);
}
