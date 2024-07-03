import * as React from "react";

export interface DamConfig {
    acceptedMimeTypes?: string[];
    scopeParts?: string[];
    enableLicenseFeature?: boolean;
    requireLicense?: boolean;
    additionalToolbarItems?: React.ReactNode;
    importSources?: Record<string, { label: React.ReactNode }>;
    contentGeneration?: {
        generateAltText?: boolean;
        generateImageTitle?: boolean;
    };
}

export const DamConfigContext = React.createContext<DamConfig | undefined>(undefined);
