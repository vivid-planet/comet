import * as React from "react";

import { SiteConfigApi, SiteConfigContext } from "./SitesConfigContext";

interface Props<Config> {
    children: React.ReactNode;
    value: SiteConfigApi<Config>;
}

export function SitesConfigProvider<Config = unknown>({ children, value }: Props<Config>) {
    //@ts-expect-error SiteConfigContext can't be generic
    return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}
