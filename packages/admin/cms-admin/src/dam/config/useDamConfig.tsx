import { useCometConfig } from "../../config/CometConfigContext";
import { DamConfig } from "./damConfig";

export function useDamConfig(): DamConfig {
    const cometConfig = useCometConfig();

    if (!cometConfig.dam) {
        throw new Error("No DAM configuration found. Make sure to set `dam` in `CometConfigProvider`.");
    }

    return cometConfig.dam;
}
