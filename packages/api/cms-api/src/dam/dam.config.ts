export interface DamConfig {
    secret: string;
    allowedImageSizes: number[];
    allowedAspectRatios: string[];
    filesDirectory: string;
    cacheDirectory: string;
    acceptedMimeTypes?: string[];
    maxFileSize: number;
}
