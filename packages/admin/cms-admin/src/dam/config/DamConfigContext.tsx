import * as React from "react";

export interface DamConfig {
    additionalMimeTypes?: string[];
    scopeParts?: string[];
}

export const DamConfigContext = React.createContext<DamConfig | undefined>(undefined);
