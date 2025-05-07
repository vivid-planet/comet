import { useCometConfig } from "../config/CometConfigContext";
import { type SiteConfigsConfig } from "./siteConfigsConfig";

export function useSiteConfigs<Configs = unknown>(): SiteConfigsConfig<Configs> {
    const cometConfig = useCometConfig<Configs>();

    if (!cometConfig.siteConfigs) {
        throw new Error("No site configs configuration found. Make sure to set `siteConfigs` in `CometConfigProvider`.");
    }

    return cometConfig.siteConfigs;
}
