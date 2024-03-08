import { getCookie, setCookie } from "cookies-next";
import jsonwebtoken from "jsonwebtoken";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse, NextPageContext } from "next";

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
    const { isAllowedSitePreview } = await graphQLClient.request(
        "query isAllowedSitePreview($scope: JSONObject!) { isAllowedSitePreview(scope: $scope) }",
        { scope },
    );
    if (!isAllowedSitePreview) {
        res.status(403).end("Preview is not allowed");
    }

    if (process.env.previewScopeSigningKey) {
        setCookie("__comet_preview_scope", jsonwebtoken.sign({ data: scope }, process.env.previewScopeSigningKey), {
            req,
            res,
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV !== "development",
            path: "/",
        });
    }

    return scope;
}

export function getPreviewScopeFromContext(context: GetServerSidePropsContext | NextPageContext): Scope | null {
    if (!process.env.previewScopeSigningKey) throw new Error("process.env.previewScopeSigningKey is not set, please add it to next.config.js");
    const cookie = getCookie("__comet_preview_scope", { req: context["req"] });
    if (cookie) {
        const payload = jsonwebtoken.verify(cookie, process.env.previewScopeSigningKey) as { data: Scope };
        return payload["data"];
    }
    return null;
}
