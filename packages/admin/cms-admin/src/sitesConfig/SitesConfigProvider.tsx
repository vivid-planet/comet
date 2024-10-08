import { PropsWithChildren } from "react";

import { SiteConfigApi, SiteConfigContext } from "./SitesConfigContext";

interface Props<Config> {
    value: SiteConfigApi<Config>;
}

export function SitesConfigProvider<Config = unknown>({ children, value }: PropsWithChildren<Props<Config>>) {
    return <SiteConfigContext.Provider value={value as SiteConfigApi<unknown>}>{children}</SiteConfigContext.Provider>;
}
