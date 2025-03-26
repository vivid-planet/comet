import { SitePreviewProvider } from "@comet/cms-site";
import { getSiteConfigForDomain } from "@src/util/siteConfig";
import { SiteConfigProvider } from "@src/util/SiteConfigProvider";
import { draftMode } from "next/headers";
import { PropsWithChildren } from "react";

export default async function SiteLayout({ children, params: { domain } }: Readonly<PropsWithChildren<{ params: { domain: string } }>>) {
    const siteConfig = await getSiteConfigForDomain(domain);
    const isDraftModeEnabled = draftMode().isEnabled;

    return (
        <SiteConfigProvider siteConfig={siteConfig}>
            {isDraftModeEnabled ? <SitePreviewProvider>{children}</SitePreviewProvider> : children}
        </SiteConfigProvider>
    );
}
