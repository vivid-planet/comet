import { NextApiRequest, NextApiResponse } from "next";

type Scope = Record<string, unknown>;
type GraphQLClient = {
    setHeader(key: string, value: string): unknown;
    request(document: string, variables?: unknown): Promise<{ isAllowedSitePreview: boolean }>;
};
export type SitePreviewParams = {
    scope: Scope;
    path: string;
    settings: {
        includeInvisible: boolean;
    };
};
export type BlockPreviewParams = {
    scope: Scope;
    path: string;
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

export async function getValidatedBlockPreviewParams(
    req: NextApiRequest,
    res: NextApiResponse,
    graphQLClient: GraphQLClient,
): Promise<BlockPreviewParams> {
    return {
        scope: await getValidatedScope(req, res, graphQLClient),
        path: req.query.path as string,
    };
}

async function getValidatedScope(req: NextApiRequest, res: NextApiResponse, graphQLClient: GraphQLClient): Promise<Scope> {
    const scope = JSON.parse(req.query.scope as string);
    if (!scope) throw new Error("Scope is missing");

    graphQLClient.setHeader("authorization", req.headers["authorization"] || "");
    const { isAllowedSitePreview } = await graphQLClient.request(
        "query isAllowedSitePreview($scope: JSONObject!) { isAllowedSitePreview(scope: $scope) }",
        { scope },
    );
    if (!isAllowedSitePreview) {
        res.status(403).end("Preview is not allowed");
    }

    return scope;
}
