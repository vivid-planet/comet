import * as React from "react";

import { SiteConfigApi, SiteConfigContext } from "./SitesConfigContext";

export function useSitesConfig<Configs = unknown>(): SiteConfigApi<Configs> {
    const context = React.useContext(SiteConfigContext);

    if (!context) {
        throw new Error(
            "No SiteConfigContext instance can be found. Please ensure that you have called `SiteConfigProvider` higher up in your tree.",
        );
    }

    //@ts-expect-error SiteConfigContext can't be generic
    return context;
}
