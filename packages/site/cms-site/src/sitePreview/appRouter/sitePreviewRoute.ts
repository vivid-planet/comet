import "server-only";

import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { SitePreviewParams, verifySitePreviewJwt } from "../SitePreviewUtils";

export async function sitePreviewRoute(request: NextRequest, _graphQLFetch: unknown /* deprecated: remove argument in v8 */) {
    const params = request.nextUrl.searchParams;
    const jwt = params.get("jwt");
    if (!jwt) {
        throw new Error("Missing jwt parameter");
    }

    const data = await verifySitePreviewJwt(jwt);

    cookies().set("__comet_preview", jwt);

    draftMode().enable();

    return redirect(data.path);
}

/**
 * Helper for SitePreview
 * @param options.skipDraftModeCheck Allows skipping the draft mode check, only required when called from middleware.ts (see https://github.com/vercel/next.js/issues/52080)
 * @return If SitePreview is active the current preview settings
 */
export async function previewParams(options: { skipDraftModeCheck: boolean } = { skipDraftModeCheck: false }): Promise<SitePreviewParams | null> {
    if (!options.skipDraftModeCheck) {
        if (!draftMode().isEnabled) return null;
    }

    const cookie = cookies().get("__comet_preview");
    if (cookie) {
        return verifySitePreviewJwt(cookie.value);
    }
    return null;
}