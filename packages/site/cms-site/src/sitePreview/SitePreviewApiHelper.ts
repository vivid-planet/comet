import { NextApiRequest, NextApiResponse } from "next";

type Scope = Record<string, unknown>;

export type PreviewData = {
    includeInvisible: boolean;
};

export type SitePreviewParams = {
    scope: Scope;
    path: string;
    settings: PreviewData;
};

export async function getValidatedSitePreviewParams(
    req: NextApiRequest,
    res: NextApiResponse,
    graphQLClient: GraphQLClient,
): Promise<SitePreviewParams> {
    return {
        scope: await getValidatedScope(req, res, graphQLClient),
        path: req.query.path as string,
        settings: JSON.parse(req.query.settings as string),
    };
}

async function getValidatedScope(req: NextApiRequest, res: NextApiResponse, graphQLClient: GraphQLClient): Promise<Scope> {
    const scope = JSON.parse(req.query.scope?.toString() ?? "{}");

    graphQLClient.setHeader("authorization", req.headers["authorization"] || "");
    const { isAllowedSitePreview } = await graphQLClient.request<{ isAllowedSitePreview: boolean }>(
        "query isAllowedSitePreview($scope: JSONObject!) { isAllowedSitePreview(scope: $scope) }",
        { scope },
    );
    if (!isAllowedSitePreview) {
        res.status(403).end("Preview is not allowed");
    }

    return scope;
}
