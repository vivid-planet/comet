import { gql } from "@apollo/client";

export const emailCampaignStatistics = gql`
    query EmailCampaignStatistics($id: ID!) {
        brevoEmailCampaignStatistics(id: $id) {
            uniqueClicks
            unsubscriptions
            delivered
            sent
            softBounces
            hardBounces
            uniqueViews
        }
    }
`;
