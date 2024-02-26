import * as React from "react";

export interface DamConfig {
    additionalMimeTypes?: string[];
    scopeParts?: string[];
    enableLicenseFeature?: boolean;
    requireLicense?: boolean;
    additionalToolbarItems?: React.ReactNode;
    importSourceTypeLabels?: Record<string, React.ReactNode>;
}

export const DamConfigContext = React.createContext<DamConfig | undefined>(undefined);
