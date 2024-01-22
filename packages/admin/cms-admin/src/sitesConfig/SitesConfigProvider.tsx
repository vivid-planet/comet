import * as React from "react";

import { SiteConfigApi, SiteConfigContext } from "./SitesConfigContext";

interface Props<Config> {
    children: React.ReactNode;
    value: SiteConfigApi<Config>;
}

export function SitesConfigProvider<Config = unknown>({ children, value }: Props<Config>) {
    return <SiteConfigContext.Provider value={value as SiteConfigApi<unknown>}>{children}</SiteConfigContext.Provider>;
}
