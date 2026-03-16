import { SitePreviewProvider } from "@comet/site-nextjs";
import { extractNextPublicEnvs } from "@src/util/nextPublic";
import { NextPublicProvider } from "@src/util/NextPublicProvider";
import { getSiteConfigForDomain } from "@src/util/siteConfig";
import { SiteConfigProvider } from "@src/util/SiteConfigProvider";
import { draftMode } from "next/headers";
import { type PropsWithChildren } from "react";

export default async function SiteLayout({ children, params: { domain } }: Readonly<PropsWithChildren<{ params: { domain: string } }>>) {
    const siteConfig = await getSiteConfigForDomain(domain);
    const isDraftModeEnabled = draftMode().isEnabled;

    return (
        <NextPublicProvider envs={extractNextPublicEnvs(process.env)}>
            <SiteConfigProvider siteConfig={siteConfig}>
                {isDraftModeEnabled ? <SitePreviewProvider>{children}</SitePreviewProvider> : children}
            </SiteConfigProvider>
        </NextPublicProvider>
    );
}
