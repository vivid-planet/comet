import { getValidatedScope, GraphQLClient, Scope } from "../util/getValidatedScope";

export type SitePreviewParams = {
    scope: Scope;
    path: string;
    settings: {
        includeInvisible: boolean;
    };
};

export async function getValidatedSitePreviewParams(request: Request, graphQLClient: GraphQLClient): Promise<SitePreviewParams> {
    const { searchParams } = new URL(request.url);
    const settings: SitePreviewParams["settings"] = { includeInvisible: false };
    if (searchParams.get("settings")) {
        try {
            const data = JSON.parse(searchParams.get("settings") || "{}");
            if (data.includeInvisible) {
                settings.includeInvisible = true;
            }
        } catch (e) {
            throw new Error("Invalid settings query parameter");
        }
    }

    let path: string;
    try {
        path = new URL(`http://comet-dxp.com${searchParams.get("path")}`).pathname;
    } catch (e) {
        path = "/";
    }
    return {
        scope: await getValidatedScope(request, graphQLClient, "pageTree"),
        path,
        settings,
    };
}
