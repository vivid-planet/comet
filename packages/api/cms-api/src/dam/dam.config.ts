export interface DamConfig {
    filesBaseUrl: string;
    imagesBaseUrl: string;
    secret: string;
    allowedImageSizes: number[];
    allowedAspectRatios: string[];
    cdnEnabled?: boolean;
    cdnDomain?: string;
    cdnOriginHeader?: string;
    filesDirectory: string;
    cacheDirectory: string;
    additionalMimeTypes?: string[];
    maxFileSize: number;
}

export const CDN_ORIGIN_CHECK_HEADER = "x-cdn-origin-check";
