import "server-only";

import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

import { setSitePreviewParams, type SitePreviewParams, verifyJwt } from "../previewUtils";

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

    await setSitePreviewParams({
        scope: data.scope,
        previewData: data.previewData,
        userId: data.userId, // for SitePreviewAuthService
    });

    draftMode().enable();

    return redirect(data.path);
}
