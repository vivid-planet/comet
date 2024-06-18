import { NextApiRequest, NextApiResponse } from "next";

import { Scope, SitePreviewParams } from "../SitePreviewUtils";

type GraphQLClient = {
    setHeader(key: string, value: string): unknown;
    request<Response, Variables>(document: string, variables?: Variables): Promise<Response>;
};

async function sitePreviewApiHandler(req: NextApiRequest, res: NextApiResponse, graphQLClient: GraphQLClient) {
    const params = req.query;
    const settingsParam = params.settings;
    const scopeParam = params.scope;

    if (typeof settingsParam !== "string" || typeof scopeParam !== "string") {
        throw new Error("Missing settings or scope parameter");
    }

    if (Array.isArray(params.path)) {
        res.status(400).json({ error: "Parameter 'path' can't be an array" });
        return;
    }

    const previewData = JSON.parse(settingsParam);
    const scope = JSON.parse(scopeParam);

    graphQLClient.setHeader("authorization", req.headers?.authorization ?? "");

    const { currentUser } = await graphQLClient.request<{ currentUser: { permissionsForScope: string[] } }, { scope: Scope }>(
        `
            query CurrentUserPermissionsForScope($scope: JSONObject!) {
                currentUser {
                    permissionsForScope(scope: $scope)
                }
            }
        `,
        { scope },
    );
    if (!currentUser.permissionsForScope.includes("pageTree")) {
        res.status(403).json({ error: "Preview is not allowed" });
        return;
    }

    const data: SitePreviewParams = { scope, previewData };

    res.setPreviewData(data);
    res.redirect(params.path ?? "/");
}

export { sitePreviewApiHandler };
