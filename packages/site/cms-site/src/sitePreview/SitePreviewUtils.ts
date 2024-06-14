//TODO add import "server-only"; once this file gets correctly tree-shaked out of the client bundle

import { jwtVerify, SignJWT } from "jose";
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

function getPreviewScopeSigningKey() {
    if (!process.env.SITE_PREVIEW_SECRET && process.env.NODE_ENV === "production") {
        throw new Error("SITE_PREVIEW_SECRET environment variable is required in production mode");
    }
    return process.env.SITE_PREVIEW_SECRET || "secret";
}

export async function sitePreviewRoute(request: NextRequest, graphQLFetch: GraphQLFetch) {
    const previewScopeSigningKey = getPreviewScopeSigningKey();
    const params = request.nextUrl.searchParams;
    const settingsParam = params.get("settings");
    const scopeParam = params.get("scope");
    if (!settingsParam || !scopeParam) {
        throw new Error("Missing settings or scope parameter");
    }

    const previewData = JSON.parse(settingsParam);
    const scope = JSON.parse(scopeParam);

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
    if (!currentUser.permissionsForScope.includes("pageTree")) {
        return new Response("Preview is not allowed", {
            status: 403,
        });
    }

    const data: SitePreviewParams = { scope, previewData };
    const token = await new SignJWT(data).setProtectedHeader({ alg: "HS256" }).sign(new TextEncoder().encode(previewScopeSigningKey));
    cookies().set("__comet_preview", token);

    draftMode().enable();

    return redirect(params.get("path") || "/");
}

/**
 * Helper for SitePreview
 * @param options - Allows skipping the draft mode check, only required when called from middleware.ts (see https://github.com/vercel/next.js/issues/52080)
 * @return If SitePreview is active the current preview settings
 */
export async function previewParams(options: { skipDraftModeCheck: boolean } = { skipDraftModeCheck: false }): Promise<SitePreviewParams | null> {
    const previewScopeSigningKey = getPreviewScopeSigningKey();

    if (!options.skipDraftModeCheck) {
        if (!draftMode().isEnabled) return null;
    }

    const cookie = cookies().get("__comet_preview");
    if (cookie) {
        const { payload } = await jwtVerify<SitePreviewParams>(cookie.value, new TextEncoder().encode(previewScopeSigningKey));
        return payload;
    }
    return null;
}
