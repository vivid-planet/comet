import "server-only";

import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

import { setSitePreviewParams, type SitePreviewJwtPayload, verifyJwt } from "../previewUtils";

export async function sitePreviewRoute(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const jwt = params.get("jwt");
    if (!jwt) {
        return NextResponse.json({ error: "JWT-Parameter is missing." }, { status: 400 });
    }

    const data = await verifyJwt<SitePreviewJwtPayload>(jwt);
    if (!data) {
        return NextResponse.json({ error: "JWT-validation failed." }, { status: 400 });
    }

    await setSitePreviewParams({
        scope: data.scope,
        previewData: data.previewData,
        userId: data.userId,
    });

    if (!data.path.startsWith("/") || data.path.startsWith("//")) {
        return NextResponse.json({ error: `Redirect to ${data.path} disallowed: only relative paths are valid.` }, { status: 400 });
    }

    return redirect(data.path);
}
