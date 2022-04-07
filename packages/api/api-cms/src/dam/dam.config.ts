export interface DamConfig {
    filesBaseUrl: string;
    imagesBaseUrl: string;
    secret: string;
    allowedImageSizes: string;
    allowedAspectRatios: string;
    additionalMimetypes?: string;
    cdnEnabled?: boolean;
    cdnDomain?: string;
    cdnOriginHeader?: string;
    filesDirectory: string;
    cacheDirectory: string;
}

export const CDN_ORIGIN_CHECK_HEADER = "x-cdn-origin-check";
