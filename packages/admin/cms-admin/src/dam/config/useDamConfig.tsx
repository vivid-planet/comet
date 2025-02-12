import { useContext } from "react";

import { type DamConfig, DamConfigContext } from "./DamConfigContext";

export function useDamConfig(): DamConfig {
    const context = useContext(DamConfigContext);
    return context ?? {};
}
