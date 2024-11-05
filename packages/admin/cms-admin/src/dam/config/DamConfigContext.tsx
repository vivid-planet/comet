import { createContext, ReactNode } from "react";

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
}

export const DamConfigContext = createContext<DamConfig | undefined>(undefined);
