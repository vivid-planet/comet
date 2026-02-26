import { gql } from "@apollo/client";

const targetGroupBrevoContactsFragment = gql`
    fragment TargetGroupBrevoContactsList on BrevoContact {
        id
        createdAt
        modifiedAt
        email
        emailBlacklisted
        smsBlacklisted
    }
`;

export const manuallyAssignedBrevoContactsGridQuery = gql`
    query ManuallyAssignedBrevoContactsGrid($offset: Int, $limit: Int, $email: String, $targetGroupId: ID!) {
        manuallyAssignedBrevoContacts(offset: $offset, limit: $limit, email: $email, targetGroupId: $targetGroupId) {
            nodes {
                ...TargetGroupBrevoContactsList
            }
            totalCount
        }
    }
    ${targetGroupBrevoContactsFragment}
`;

export const brevoContactsQuery = gql`
    query AllBrevoContactsGrid($offset: Int, $limit: Int, $email: String, $scope: EmailCampaignContentScopeInput!) {
        brevoContacts(offset: $offset, limit: $limit, email: $email, scope: $scope) {
            nodes {
                ...TargetGroupBrevoContactsList
            }
            totalCount
        }
    }
    ${targetGroupBrevoContactsFragment}
`;

export const addBrevoContactsToTargetGroupMutation = gql`
    mutation AddBrevoContactsToTargetGroup($id: ID!, $input: AddBrevoContactsInput!) {
        addBrevoContactsToTargetGroup(id: $id, input: $input)
    }
`;

export const removeBrevoContactFromTargetGroupMutation = gql`
    mutation RemoveBrevoContactFromTargetGroup($id: ID!, $input: RemoveBrevoContactInput!) {
        removeBrevoContactFromTargetGroup(id: $id, input: $input)
    }
`;
