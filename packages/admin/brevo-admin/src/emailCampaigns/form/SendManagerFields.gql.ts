import { gql } from "@apollo/client";

const targetGroupSelectFragment = gql`
    fragment TargetGroupSelect on BrevoTargetGroup {
        id
        title
    }
`;

export const targetGroupsSelectQuery = gql`
    query TargetGroupsSelect($scope: EmailCampaignContentScopeInput!) {
        brevoTargetGroups(scope: $scope, limit: 100) {
            nodes {
                ...TargetGroupSelect
            }
        }
    }

    ${targetGroupSelectFragment}
`;

export const sendEmailCampaignNowMutation = gql`
    mutation SendEmailCampaignNow($id: ID!) {
        sendBrevoEmailCampaignNow(id: $id)
    }
`;
