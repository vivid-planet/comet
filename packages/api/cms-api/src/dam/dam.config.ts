export interface DamConfig {
    filesBaseUrl: string;
    imagesBaseUrl: string;
    secret: string;
    allowedImageSizes: number[];
    allowedAspectRatios: string[];
    filesDirectory: string;
    cacheDirectory: string;
    additionalMimeTypes?: string[];
    maxFileSize: number;
}
