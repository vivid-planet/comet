export interface DamConfig {
    apiUrl: string;
    secret: string;
    allowedImageSizes: number[];
    allowedAspectRatios: string[];
    filesDirectory: string;
    cacheDirectory: string;
    additionalMimeTypes?: string[];
    maxFileSize: number;
}
