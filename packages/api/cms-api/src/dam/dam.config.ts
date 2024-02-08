export interface DamConfig {
    privateApiUrl: string; // URLs for preview
    publicApiUrl: string;
    secret: string;
    allowedImageSizes: number[];
    allowedAspectRatios: string[];
    filesDirectory: string;
    cacheDirectory: string;
    additionalMimeTypes?: string[];
    maxFileSize: number;
}
