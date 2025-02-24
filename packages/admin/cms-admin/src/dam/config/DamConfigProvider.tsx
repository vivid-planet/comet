import { type PropsWithChildren } from "react";

import { type DamConfig, DamConfigContext } from "./DamConfigContext";

interface DamConfigProviderProps {
    value: DamConfig;
}

export const DamConfigProvider = ({ children, value }: PropsWithChildren<DamConfigProviderProps>) => {
    return <DamConfigContext.Provider value={{ enableLicenseFeature: false, requireLicense: false, ...value }}>{children}</DamConfigContext.Provider>;
};
