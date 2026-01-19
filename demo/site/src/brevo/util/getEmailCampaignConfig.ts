import { type ContentScope } from "@src/site-configs";
import { getSiteConfigForDomain } from "@src/util/siteConfig";

export interface EmailCampaignConfig {
    images: {
        validSizes: number[];
        baseUrl: string;
    };
}

export function getEmailCampaignConfig(scope: ContentScope): EmailCampaignConfig {
    if (process.env.DAM_ALLOWED_IMAGE_SIZES === undefined || process.env.DAM_ALLOWED_IMAGE_SIZES.trim() === "") {
        throw new Error("Environment variable DAM_ALLOWED_IMAGE_SIZES is not defined");
    }

    const validSizes = process.env.DAM_ALLOWED_IMAGE_SIZES.split(",").map((value) => parseInt(value));

    return { images: { validSizes, baseUrl: getSiteConfigForDomain(scope.domain).url } };
}
