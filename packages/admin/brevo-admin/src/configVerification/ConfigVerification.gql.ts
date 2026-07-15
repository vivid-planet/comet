import { gql } from "@apollo/client";

export const brevoConfigCheckQuery = gql`
    query BrevoConfigCheck($scope: EmailCampaignContentScopeInput!) {
        brevoConfig(scope: $scope) {
            id
        }
    }
`;
