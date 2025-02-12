export const dynamic = "force-dynamic";

import { getSiteConfigForDomain } from "@src/util/siteConfig";
import { SiteConfigProvider } from "@src/util/SiteConfigProvider";
import { type PropsWithChildren } from "react";

export default async function BlockPreviewLayout({ children, params: { domain } }: Readonly<PropsWithChildren<{ params: { domain: string } }>>) {
    const siteConfig = await getSiteConfigForDomain(domain);
    return <SiteConfigProvider siteConfig={siteConfig}>{children}</SiteConfigProvider>;
}
