import { type GetEmailCampaignsCampaignsInner } from "@getbrevo/brevo";

interface BrevoStatistics {
    uniqueClicks: number;
    clickers: number;
    complaints: number;
    delivered: number;
    sent: number;
    softBounces: number;
    hardBounces: number;
    uniqueViews: number;
    trackableViews: number;
    estimatedViews?: number;
    unsubscriptions: number;
    viewed: number;
}

export interface BrevoApiCampaign {
    id: number;
    name: string;
    subject?: string;
    type: GetEmailCampaignsCampaignsInner.TypeEnum;
    status: GetEmailCampaignsCampaignsInner.StatusEnum;
    statistics: {
        globalStats: BrevoStatistics; // Overall statistics of the campaign
        campaignStats: BrevoStatistics[]; // List-wise statistics of the campaign.
    };
    sentDate?: string;
    scheduledAt?: string;
}
