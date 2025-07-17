import "server-only";

import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

import { type BlockPreviewParams, type PreviewParams, verifyJwt } from "../previewUtils";

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

    const cookieJwt = await new SignJWT({
        scope: data.scope,
    } satisfies PreviewParams)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1 day")
        .sign(new TextEncoder().encode(process.env.SITE_PREVIEW_SECRET));
    cookies().set("__comet_block_preview", cookieJwt, { httpOnly: true, sameSite: "lax" });

    return redirect(data.url);
}
