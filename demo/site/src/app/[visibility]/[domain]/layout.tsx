import { SitePreviewProvider } from "@comet/site-nextjs";
import { getSiteConfigForDomain } from "@src/util/siteConfig";
import { SiteConfigProvider } from "@src/util/SiteConfigProvider";
import { draftMode } from "next/headers";
import { type PropsWithChildren } from "react";

type Params = Promise<{ domain: string }>;

export default async function SiteLayout({ children, params }: Readonly<PropsWithChildren<{ params: Params }>>) {
    const { domain } = await params;
    const siteConfig = getSiteConfigForDomain(domain);
    const isDraftModeEnabled = (await draftMode()).isEnabled;

    return (
        <SiteConfigProvider siteConfig={siteConfig}>
            {isDraftModeEnabled ? <SitePreviewProvider>{children}</SitePreviewProvider> : children}
        </SiteConfigProvider>
    );
}
