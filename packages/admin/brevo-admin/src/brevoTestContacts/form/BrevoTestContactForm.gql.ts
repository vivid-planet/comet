import { type DocumentNode, gql } from "@apollo/client";

export const brevoContactFormQuery = (brevoTestContactFormFragment: DocumentNode) => gql`
    query BrevoContactForm($id: Int!, $scope: EmailCampaignContentScopeInput!) {
        brevoContact(id: $id, scope: $scope) {
            id
            modifiedAt
            ...BrevoTestContactForm
        }
    }
    ${brevoTestContactFormFragment}
`;

export const brevoContactFormCheckForChangesQuery = gql`
    query BrevoContactFormCheckForChanges($id: Int!, $scope: EmailCampaignContentScopeInput!) {
        brevoContact(id: $id, scope: $scope) {
            modifiedAt
        }
    }
`;

export const createBrevoTestContactMutation = gql`
    mutation CreateBrevoTestContact($scope: EmailCampaignContentScopeInput!, $input: BrevoTestContactInput!) {
        createBrevoTestContact(scope: $scope, input: $input)
    }
`;

export const updateBrevoContactMutation = (brevoTestContactFormFragment: DocumentNode) => gql`
    mutation UpdateBrevoContact($id: Int!, $input: BrevoContactUpdateInput!, $scope: EmailCampaignContentScopeInput!) {
        updateBrevoContact(id: $id, input: $input, scope: $scope) {
            id
            modifiedAt
            ...BrevoTestContactForm
        }
    }
    ${brevoTestContactFormFragment}
`;
