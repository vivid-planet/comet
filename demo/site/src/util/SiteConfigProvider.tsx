"use client";

import type { PublicSiteConfig } from "@src/site-configs.d";
import { createContext, PropsWithChildren, useContext } from "react";

export const SiteConfigContext = createContext<PublicSiteConfig | undefined>(undefined);
export const useSiteConfig = () => {
    const siteConfig = useContext(SiteConfigContext);
    if (!siteConfig) throw new Error("SiteConfig not set in SiteConfigProvider");
    return siteConfig;
};

export function SiteConfigProvider({ children, siteConfig }: PropsWithChildren<{ siteConfig?: PublicSiteConfig }>) {
    return <SiteConfigContext.Provider value={siteConfig}>{children}</SiteConfigContext.Provider>;
}
