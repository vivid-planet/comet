import * as React from "react";

import { DamConfig, DamConfigContext } from "./DamConfigContext";

interface DamConfigProviderProps {
    value: DamConfig;
}

export const DamConfigProvider: React.FunctionComponent<DamConfigProviderProps> = ({ children, value }) => {
    return <DamConfigContext.Provider value={{ enableLicenseFeature: false, requireLicense: false, ...value }}>{children}</DamConfigContext.Provider>;
};
