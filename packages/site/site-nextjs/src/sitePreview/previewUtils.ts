import { type PreviewData } from "@comet/site-react";
import { errors, jwtVerify } from "jose";
import { cookies, draftMode } from "next/headers";

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
