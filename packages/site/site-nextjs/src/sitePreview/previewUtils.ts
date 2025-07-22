import { type PreviewData } from "@comet/site-react";
import { errors, jwtVerify, SignJWT } from "jose";
import { cookies, draftMode, headers as getHeaders } from "next/headers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Scope = Record<string, any>;

export type SitePreviewParams = {
    userId: string;
    scope: Scope;
    path: string;
    previewData?: PreviewData;
};

export type BlockPreviewParams = {
    scope: Scope;
    url: string;
};

export async function verifyJwt<T>(jwt: string): Promise<T | null> {
    if (!process.env.SITE_PREVIEW_SECRET) {
        throw new Error("SITE_PREVIEW_SECRET environment variable is required.");
    }
    try {
        const data = await jwtVerify<T>(jwt, new TextEncoder().encode(process.env.SITE_PREVIEW_SECRET));
        return data.payload;
    } catch (e) {
        if (e instanceof errors.JOSEError) return null;
        throw e;
    }
}

export type PreviewParams = {
    scope: Scope;
    previewData?: PreviewData;
};

/**
 * Helper for SitePreview
 * @param options.skipDraftModeCheck Allows skipping the draft mode check, only required when called from middleware.ts (see https://github.com/vercel/next.js/issues/52080)
 * @return If SitePreview is active the current preview settings
 */
export async function previewParams(options: { skipDraftModeCheck: boolean } = { skipDraftModeCheck: false }): Promise<PreviewParams | null> {
    const headers = getHeaders();
    if (headers.has("x-block-preview")) {
        return verifyJwt<PreviewParams>(headers.get("x-block-preview") || "");
    }
    if (!options.skipDraftModeCheck) {
        if (!draftMode().isEnabled) return null;
    }

    if (!options.skipDraftModeCheck) {
        if (!draftMode().isEnabled) return null;
    }

    const cookie = cookies().get("__comet_preview");
    if (cookie) {
        return verifyJwt<PreviewParams>(cookie.value);
    }

    return null;
}

export async function setPreviewParams(payload: PreviewParams & { [key: string]: unknown }) {
    const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1 day")
        .sign(new TextEncoder().encode(process.env.SITE_PREVIEW_SECRET));
    cookies().set("__comet_preview", jwt, { httpOnly: true, sameSite: "lax" });
}
