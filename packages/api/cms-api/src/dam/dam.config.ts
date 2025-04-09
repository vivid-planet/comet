export interface DamConfig {
    apiUrl: string;
    secret: string;
    allowedImageSizes: number[];
    allowedAspectRatios: string[];
    filesDirectory: string;
    cacheDirectory: string;
    acceptedMimeTypes?: string[];
    maxFileSize: number;
    requireLicense?: boolean;
    enableLicenseFeature?: boolean;
}
