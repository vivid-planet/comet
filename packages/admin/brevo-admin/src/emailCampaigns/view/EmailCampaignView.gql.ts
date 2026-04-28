import { gql } from "@apollo/client";

export const emailCampaignViewQuery = gql`
    query EmailCampaignView($id: ID!) {
        brevoEmailCampaign(id: $id) {
            id
            content
        }
    }
`;
