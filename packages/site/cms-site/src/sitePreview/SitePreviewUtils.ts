//TODO add import "server-only"; once this file gets correctly tree-shaked out of the client bundle

import jsonwebtoken from "jsonwebtoken";
import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

import { GraphQLFetch } from "../graphQLFetch/graphQLFetch";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Scope = Record<string, any>;

export type SitePreviewData = {
    includeInvisible: boolean;
};
export type SitePreviewParams = {
    scope: Scope;
    previewData?: SitePreviewData;
};

if (!process.env.SITE_PREVIEW_SECRET && process.env.NODE_ENV === "production") {
    throw new Error("SITE_PREVIEW_SECRET environment variable is required in production mode");
}
const previewScopeSigningKey = process.env.SITE_PREVIEW_SECRET || "secret";

export async function sitePreviewRoute(request: NextRequest, graphQLFetch: GraphQLFetch) {
    const params = request.nextUrl.searchParams;
    const settingsParam = params.get("settings");
    const scopeParam = params.get("scope");
    if (!settingsParam || !scopeParam) {
        throw new Error("Missing settings or scope parameter");
    }

    const previewData = JSON.parse(settingsParam);
    const scope = JSON.parse(scopeParam);

    const { isAllowedSitePreview } = await graphQLFetch<{ isAllowedSitePreview: boolean }, { scope: unknown }>(
        `
            query isAllowedSitePreview($scope: JSONObject!) {
                isAllowedSitePreview(scope: $scope)
            }
        `,
        { scope },
        {
            headers: {
                authorization: request.headers.get("authorization") || "",
            },
        },
    );
    if (!isAllowedSitePreview) {
        return new Response("Preview is not allowed", {
            status: 403,
        });
    }

    const data: SitePreviewParams = { scope, previewData };
    cookies().set("__comet_preview", jsonwebtoken.sign(data, previewScopeSigningKey));

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
