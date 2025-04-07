import { type ReactNode } from "react";

import { useCometConfig } from "../../config/CometConfigContext";

export interface DamConfig {
    acceptedMimeTypes?: string[];
    scopeParts?: string[];
    enableLicenseFeature?: boolean;
    requireLicense?: boolean;
    additionalToolbarItems?: ReactNode;
    importSources?: Record<string, { label: ReactNode }>;
    contentGeneration?: {
        generateAltText?: boolean;
        generateImageTitle?: boolean;
    };
    uploadsMaxFileSize: number;
    allowedImageAspectRatios: string[];
}

export function useDamConfig(): DamConfig {
    const cometConfig = useCometConfig();

    if (!cometConfig.dam) {
        throw new Error("No DAM configuration found. Make sure to set `dam` in `CometConfigProvider`.");
    }

    return cometConfig.dam;
}
