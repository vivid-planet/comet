import * as React from "react";

import { DamConfig, DamConfigContext } from "./DamConfigContext";

export function useDamConfig(): DamConfig {
    const context = React.useContext(DamConfigContext);
    return context ?? {};
}
