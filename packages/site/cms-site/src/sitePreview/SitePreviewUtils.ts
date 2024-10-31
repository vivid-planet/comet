import { jwtVerify } from "jose";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Scope = Record<string, any>;

export type SitePreviewData = {
    includeInvisible: boolean;
};
export type SitePreviewParams = {
    scope: Scope;
    path: string;
    previewData?: SitePreviewData;
};

export async function verifySitePreviewJwt(jwt: string): Promise<SitePreviewParams> {
    if (!process.env.SITE_PREVIEW_SECRET) {
        throw new Error("SITE_PREVIEW_SECRET environment variable is required.");
    }
    const data = await jwtVerify<SitePreviewParams>(jwt, new TextEncoder().encode(process.env.SITE_PREVIEW_SECRET));
    return data.payload;
}
