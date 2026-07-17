export interface DamConfig {
    secret: string;
    allowedImageSizes: number[];
    allowedAspectRatios: string[];
    filesDirectory: string;
    acceptedMimeTypes?: string[];
    /**
     * Some browsers upload certain files (e.g. `.msg`, `.eml`) with the generic `application/octet-stream`
     * mime type instead of their specific one, which causes them to be rejected. List the affected file
     * extensions here to accept them despite the generic mime type. The extension's specific mime type
     * must still be included in `acceptedMimeTypes`; arbitrary `application/octet-stream` uploads
     * (e.g. executables) remain rejected.
     *
     * @default undefined
     */
    acceptedFileExtensionsForOctetStream?: string[];
    maxFileSize: number;
    requireLicense?: boolean;
    enableLicenseFeature?: boolean;
    maxSrcResolution: number;
    basePath: string;
}
