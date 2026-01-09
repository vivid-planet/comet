export interface EmailCampaignConfig {
    images: {
        validSizes: number[];
        baseUrl: string;
    };
}

export function getEmailCampaignConfigFromEnvVariables(): EmailCampaignConfig {
    if (process.env.DAM_ALLOWED_IMAGE_SIZES === undefined || process.env.DAM_ALLOWED_IMAGE_SIZES.trim() === "") {
        throw new Error("Environment variable DAM_ALLOWED_IMAGE_SIZES is not defined");
    }

    const validSizes = process.env.DAM_ALLOWED_IMAGE_SIZES.split(",").map((value) => parseInt(value));

    if (process.env.BREVO_CAMPAIGN_URL === undefined || process.env.BREVO_CAMPAIGN_URL.trim() === "") {
        throw new Error("Environment variable BREVO_CAMPAIGN_URL is not defined");
    }

    const baseUrl = process.env.BREVO_CAMPAIGN_URL;

    return { images: { validSizes, baseUrl } };
}
