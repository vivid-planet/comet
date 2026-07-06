import { gql } from "@apollo/client";

export const brevoConfigQuery = gql`
    query IsBrevoConfigDefined($scope: EmailCampaignContentScopeInput!) {
        isBrevoConfigDefined(scope: $scope)
    }
`;
