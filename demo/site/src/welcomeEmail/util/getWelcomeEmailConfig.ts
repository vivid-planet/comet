import type { Config } from "@comet/mail-react";
import cometConfig from "@src/comet-config.json" with { type: "json" };
import type { ContentScope } from "@src/site-configs";
import { getSiteConfigForDomain } from "@src/util/siteConfig";

export function getWelcomeEmailConfig(scope: ContentScope): Config {
    const validSizes = [...cometConfig.images.imageSizes, ...cometConfig.images.deviceSizes];
    return {
        pixelImageBlock: {
            validSizes,
            baseUrl: getSiteConfigForDomain(scope.domain).url,
        },
    };
}
