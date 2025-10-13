export const dynamic = "force-dynamic";

import { getSiteConfigForDomain } from "@src/util/siteConfig";
import { SiteConfigProvider } from "@src/util/SiteConfigProvider";
import { type PropsWithChildren } from "react";

type Params = Promise<{ domain: string }>;

export default async function BlockPreviewLayout({ children, params }: Readonly<PropsWithChildren<{ params: Params }>>) {
    const { domain } = await params;
    const siteConfig = getSiteConfigForDomain(domain);
    return <SiteConfigProvider siteConfig={siteConfig}>{children}</SiteConfigProvider>;
}
