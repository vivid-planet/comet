import { headers } from "next/headers";

export type Scope = Record<string, unknown>;
export type GraphQLClient = {
    setHeader(key: string, value: string): unknown;
    request<T>(document: string, variables?: unknown): Promise<T>;
};

export async function getValidatedScope(request: Request, graphQLClient: GraphQLClient, permission: string): Promise<Record<string, unknown>> {
    const { searchParams } = new URL(request.url);
    let scope: Scope;
    try {
        scope = JSON.parse(searchParams.get("scope") || "{}");
    } catch (e) {
        throw new Error("Missing or wrong scope query parameter");
    }

    const headersList = headers();
    graphQLClient.setHeader("authorization", headersList.get("authorization") || "");
    const { currentUser } = await graphQLClient.request<{ currentUser: { permissionsForScope: string[] } }>(
        "query CurrentUserPermissionsForScope($scope: JSONObject!) { currentUser{ permissionsForScope(scope: $scope) } }",
        { scope },
    );
    if (!currentUser.permissionsForScope.includes(permission)) {
        throw new Error("You don't have permission to access this scope");
    }
    return scope;
}
