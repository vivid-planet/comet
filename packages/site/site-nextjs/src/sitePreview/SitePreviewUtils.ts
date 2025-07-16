import { type PreviewData } from "@comet/site-react";
import { errors, jwtVerify } from "jose";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Scope = Record<string, any>;

export type SitePreviewParams = {
    userId: string;
    scope: Scope;
    path: string;
    previewData?: PreviewData;
};

export async function verifySitePreviewJwt(jwt: string): Promise<SitePreviewParams | null> {
    return verifyJwt<SitePreviewParams>(jwt);
}

export type PreviewParams = Pick<SitePreviewParams, "scope" | "previewData">;

export async function verifyPreviewJwt(jwt: string): Promise<PreviewParams | null> {
    return verifyJwt<PreviewParams>(jwt);
}

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
