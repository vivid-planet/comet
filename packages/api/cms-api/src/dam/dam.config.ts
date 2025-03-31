export interface DamConfig {
    apiUrl: string;
    secret: string;
    allowedImageSizes: number[];
    allowedAspectRatios: string[];
    filesDirectory: string;
    acceptedMimeTypes?: string[];
    maxFileSize: number;
    maxSrcResolution: number;
}
