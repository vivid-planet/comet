import { type PreviewData } from "@comet/site-react";
import { errors, jwtVerify } from "jose";

// Return type of previewParams function
type PreviewParams = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scope: Record<string, any>;
    previewData?: PreviewData;
};

// For site preview cookie, used by SitePreviewAuthService
export type SitePreviewParams = PreviewParams & {
    userId: string;
};

// Type created by sitePreviewJwt resolver in cms-api
export type SitePreviewJwtPayload = SitePreviewParams & {
    path: string;
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
