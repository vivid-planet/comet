import { getSiteConfigForDomain } from "@src/util/siteConfig";
import { SiteConfigProvider } from "@src/util/SiteConfigProvider";
import { getPreviewParams } from "@src/util/sitePreview";
import { SitePreviewProvider } from "@src/util/SitePreviewProvider";
import type { PropsWithChildren } from "react";

export default async function SiteLayout({ children, domain }: PropsWithChildren<{ domain: string }>) {
    const siteConfig = getSiteConfigForDomain(domain);
    const isSitePreview = (await getPreviewParams()) !== null;

    return (
        <SiteConfigProvider siteConfig={siteConfig}>
            {isSitePreview ? <SitePreviewProvider>{children}</SitePreviewProvider> : children}
        </SiteConfigProvider>
    );
}
