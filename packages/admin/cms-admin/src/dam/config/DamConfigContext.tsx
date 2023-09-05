import * as React from "react";

export interface DamConfig {
    additionalMimeTypes?: string[];
    enableLicenseFeature?: boolean;
}

export const DamConfigContext = React.createContext<DamConfig | undefined>(undefined);
