import { NextRequest } from "next/server";

import { GraphQLFetch } from "../graphQLFetch/graphQLFetch";

export type Scope = Record<string, unknown>;
export type GraphQLClient = {
    setHeader(key: string, value: string): unknown;
    request<T>(document: string, variables?: unknown): Promise<T>;
};

export async function getValidatedScope(
    request: NextRequest,
    graphQLFetch: GraphQLFetch,
    permission: string,
): Promise<Record<string, unknown> | null> {
    const params = request.nextUrl.searchParams;
    const scopeParam = params.get("scope");
    if (!scopeParam) {
        throw new Error("Missing scope parameter");
    }
    const scope = JSON.parse(scopeParam);

    const { currentUser } = await graphQLFetch<{ currentUser: { permissionsForScope: string[] } }, { scope: unknown }>(
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

    if (!currentUser.permissionsForScope.includes(permission)) {
        return null;
    }
    return scope;
}
