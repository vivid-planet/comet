import { gql } from "@apollo/client";

export const startBrevoContactImportMutation = gql`
    mutation StartBrevoContactImport($scope: EmailCampaignContentScopeInput!, $fileId: ID!, $sendDoubleOptIn: Boolean!, $targetGroupIds: [ID!]) {
        startBrevoContactImport(scope: $scope, fileId: $fileId, sendDoubleOptIn: $sendDoubleOptIn, targetGroupIds: $targetGroupIds) {
            created
            updated
            failed
            blacklisted
            failedColumns
            blacklistedColumns
            errorMessage
        }
    }
`;
