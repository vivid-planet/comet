import cometConfig from "@src/comet-config.json" with { type: "json" };
import { type ContentScope } from "@src/site-configs";
import { getSiteConfigForDomain } from "@src/util/siteConfig";

export interface EmailCampaignConfig {
    images: {
        validSizes: number[];
        baseUrl: string;
    };
}

export function getEmailCampaignConfig(scope: ContentScope): EmailCampaignConfig {
    const validSizes = [...cometConfig.images.imageSizes, ...cometConfig.images.deviceSizes];
    return { images: { validSizes, baseUrl: getSiteConfigForDomain(scope.domain).url } };
}
