import * as React from "react";

export interface DamConfig {
    additionalMimeTypes?: string[];
    overrideAcceptedMimeTypes?: string[];
    scopeParts?: string[];
    enableLicenseFeature?: boolean;
    requireLicense?: boolean;
    additionalToolbarItems?: React.ReactNode;
    importSources?: Record<string, { label: React.ReactNode }>;
}

export const DamConfigContext = React.createContext<DamConfig | undefined>(undefined);
