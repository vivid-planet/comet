import { SitePreviewProvider } from "@comet/cms-site";
import { setPreviewDataContext } from "@src/util/ServerContext";
import { decodePageProps } from "@src/util/siteConfig";
import { SiteConfigProvider } from "@src/util/SiteConfigProvider";
import { PropsWithChildren } from "react";

export default async function SiteLayout(props: Readonly<PropsWithChildren<{ params: { domain: string } }>>) {
    const { siteConfig, children, isDraftModeEnabled, previewData } = decodePageProps(props);
    setPreviewDataContext(previewData);

    return (
        <SiteConfigProvider siteConfig={siteConfig}>
            {isDraftModeEnabled ? <SitePreviewProvider>{children}</SitePreviewProvider> : children}
        </SiteConfigProvider>
    );
}
