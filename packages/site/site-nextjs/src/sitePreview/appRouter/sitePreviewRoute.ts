import "server-only";

import { SignJWT } from "jose";
import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

import { type PreviewParams, type SitePreviewParams, verifyJwt } from "../SitePreviewUtils";

export async function sitePreviewRoute(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const jwt = params.get("jwt");
    if (!jwt) {
        return NextResponse.json({ error: "JWT-Parameter is missing." }, { status: 400 });
    }

    const data = await verifyJwt<SitePreviewParams>(jwt);
    if (!data) {
        return NextResponse.json({ error: "JWT-validation failed." }, { status: 400 });
    }

    const cookieJwt = await new SignJWT({
        userId: data.userId,
        scope: data.scope,
        path: data.path,
        previewData: data.previewData,
    } satisfies PreviewParams & SitePreviewParams)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1 day")
        .sign(new TextEncoder().encode(process.env.SITE_PREVIEW_SECRET));
    cookies().set("__comet_preview", cookieJwt, { httpOnly: true, sameSite: "lax" });

    draftMode().enable();

    return redirect(data.path);
}

/**
 * Helper for SitePreview
 * @param options.skipDraftModeCheck Allows skipping the draft mode check, only required when called from middleware.ts (see https://github.com/vercel/next.js/issues/52080)
 * @return If SitePreview is active the current preview settings
 */
export async function previewParams(options: { skipDraftModeCheck: boolean } = { skipDraftModeCheck: false }): Promise<PreviewParams | null> {
    if (!options.skipDraftModeCheck) {
        if (!draftMode().isEnabled) return null;
    }

    const sitePreviewCookie = cookies().get("__comet_preview");
    if (sitePreviewCookie) {
        return verifyJwt<PreviewParams>(sitePreviewCookie.value);
    }
    const blockPreviewCookie = cookies().get("__comet_block_preview");
    if (blockPreviewCookie) {
        return verifyJwt<PreviewParams>(blockPreviewCookie.value);
    }

    return null;
}
