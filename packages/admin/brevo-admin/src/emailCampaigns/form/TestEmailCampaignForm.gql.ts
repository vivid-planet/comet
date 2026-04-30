import { gql } from "@apollo/client";

export const SendEmailCampaignToTestEmailsMutation = gql`
    mutation SendEmailCampaignToTestEmails($id: ID!, $data: SendTestEmailCampaignArgs!) {
        sendBrevoEmailCampaignToTestEmails(id: $id, data: $data)
    }
`;
