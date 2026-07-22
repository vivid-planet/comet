export interface DamConfig {
    secret: string;
    allowedImageSizes: number[];
    allowedAspectRatios: string[];
    filesDirectory: string;
    acceptedMimeTypes?: string[];
    maxFileSize: number;
    requireLicense?: boolean;
    enableLicenseFeature?: boolean;
    maxSrcResolution: number;
    basePath: string;
    /**
     * Disables the scope-based access control checks in the DAM controllers.
     *
     * Leave unset in a full Comet app: the endpoints use the registered `AccessControlService` as before. If no access control
     * service is available, the endpoints fail closed (403 Forbidden). Set to `true` only when running the DAM standalone behind
     * your own authentication guard — the DAM will then skip its own scope checks.
     */
    disableScopeAccessControl?: boolean;
}
