import "server-only";

import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

import { type BlockPreviewParams, setPreviewParams, verifyJwt } from "../previewUtils";

export async function blockPreviewRoute(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const jwt = params.get("jwt");
    if (!jwt) {
        return NextResponse.json({ error: "JWT-Parameter is missing." }, { status: 400 });
    }

    const data = await verifyJwt<BlockPreviewParams>(jwt);
    if (!data) {
        return NextResponse.json({ error: "JWT-validation failed." }, { status: 400 });
    }

    await setPreviewParams({
        scope: data.scope,
    });

    return redirect(data.url);
}
