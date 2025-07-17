export const dynamic = "force-dynamic";

import { getSiteConfigForDomain } from "@src/util/siteConfig";
import { SiteConfigProvider } from "@src/util/SiteConfigProvider";
import { type PropsWithChildren } from "react";

import { BlockPreviewLayoutClient } from "./BlockPreviewLayoutClient";

export default async function BlockPreviewLayout({ children, params: { domain } }: Readonly<PropsWithChildren<{ params: { domain: string } }>>) {
    const siteConfig = await getSiteConfigForDomain(domain);
    return (
        <BlockPreviewLayoutClient siteConfig={siteConfig}>
            <SiteConfigProvider siteConfig={siteConfig}>{children}</SiteConfigProvider>
        </BlockPreviewLayoutClient>
    );
}
