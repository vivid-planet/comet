import { useContext } from "react";

import { DamConfig, DamConfigContext } from "./DamConfigContext";

export function useDamConfig(): DamConfig {
    const context = useContext(DamConfigContext);
    return context ?? {};
}
