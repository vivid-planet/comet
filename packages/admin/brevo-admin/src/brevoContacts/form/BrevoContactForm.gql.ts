import { type DocumentNode, gql } from "@apollo/client";

export const brevoContactFormQuery = (brevoContactFormFragment: DocumentNode) => gql`
    query BrevoContactForm($id: Int!, $scope: EmailCampaignContentScopeInput!) {
        brevoContact(id: $id, scope: $scope) {
            id
            modifiedAt
            ...BrevoContactForm
        }
    }
    ${brevoContactFormFragment}
`;

export const brevoContactFormCheckForChangesQuery = gql`
    query BrevoContactFormCheckForChanges($id: Int!, $scope: EmailCampaignContentScopeInput!) {
        brevoContact(id: $id, scope: $scope) {
            modifiedAt
        }
    }
`;

export const createBrevoContactMutation = gql`
    mutation CreateBrevoContact($scope: EmailCampaignContentScopeInput!, $input: BrevoContactInput!) {
        createBrevoContact(scope: $scope, input: $input)
    }
`;

export const updateBrevoContactMutation = (brevoContactFormFragment: DocumentNode) => gql`
    mutation UpdateBrevoContact($id: Int!, $input: BrevoContactUpdateInput!, $scope: EmailCampaignContentScopeInput!) {
        updateBrevoContact(id: $id, input: $input, scope: $scope) {
            id
            modifiedAt
            ...BrevoContactForm
        }
    }
    ${brevoContactFormFragment}
`;
