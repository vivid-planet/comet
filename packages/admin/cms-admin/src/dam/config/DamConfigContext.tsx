import * as React from "react";

export interface DamConfig {
    enableLicenseFeature?: boolean;
    additionalMimeTypes?: string[];
    scopeParts?: string[];
}

export const DamConfigContext = React.createContext<DamConfig | undefined>(undefined);
