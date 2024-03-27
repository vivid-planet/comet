import jsonwebtoken from "jsonwebtoken";
import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Scope = Record<string, any>;
type GraphQLClient = {
    setHeader(key: string, value: string): unknown;
    request(document: string, variables?: unknown): Promise<{ isAllowedSitePreview: boolean }>;
};
export type SitePreviewData = {
    includeInvisible: boolean;
};
export type SitePreviewParams = {
    scope: Scope;
    previewData?: SitePreviewData;
};

const previewScopeSigningKey = "random"; // TODO improve randomness

export async function sitePreviewRoute(request: NextRequest, graphQLClient: GraphQLClient) {
    const params = request.nextUrl.searchParams;
    const settingsParam = params.get("settings");
    const scopeParam = params.get("scope");
    if (!settingsParam || !scopeParam) {
        throw new Error("Missing settings or scope parameter");
    }

    const previewData = JSON.parse(settingsParam);
    const scope = JSON.parse(scopeParam);

    graphQLClient.setHeader("authorization", request.headers.get("authorization") || ""); // TODO don't modify the client
    const { isAllowedSitePreview } = await graphQLClient.request(
        `
            query isAllowedSitePreview($scope: JSONObject!) {
                isAllowedSitePreview(scope: $scope)
            }
        `,
        { scope },
    );
    if (!isAllowedSitePreview) {
        return new Response("Preview is not allowed", {
            status: 403,
        });
    }

    const data: SitePreviewParams = { scope, previewData };
    cookies().set("__comet_preview", jsonwebtoken.sign(data, previewScopeSigningKey));
    /*
    TODO is next-cookie needed?
    setCookie("__comet_preview_scope", jsonwebtoken.sign(data, previewScopeSigningKey), {
        req,
        res,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV !== "development",
        path: "/",
    });
    */

    draftMode().enable();

    return redirect(params.get("path") || "/");
}

export function previewParams(): SitePreviewParams | null {
    if (!draftMode().isEnabled) return null;
    const cookie = cookies().get("__comet_preview");
    if (cookie) {
        return jsonwebtoken.verify(cookie.value, previewScopeSigningKey) as SitePreviewParams;
    }
    return null;
}
