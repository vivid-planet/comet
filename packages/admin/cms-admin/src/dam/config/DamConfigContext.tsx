import * as React from "react";

import { DamRow } from "../DataGrid/FolderDataGrid";

export interface DamConfig {
    additionalMimeTypes?: string[];
    scopeParts?: string[];
    enableLicenseFeature?: boolean;
    requireLicense?: boolean;
    additionalToolbarItems?: React.ReactNode;
    renderAdditionalRowContent?: (row: DamRow) => React.ReactNode;
}

export const DamConfigContext = React.createContext<DamConfig | undefined>(undefined);
