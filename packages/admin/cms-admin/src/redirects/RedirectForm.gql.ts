import { gql } from "@apollo/client";

export const redirectDetailFragment = gql`
    fragment RedirectDetail on Redirect {
        id
        sourceType
        source
        target
        comment
        generationType
        updatedAt
    }
`;

export const redirectDetailQuery = gql`
    query RedirectDetail($id: ID!) {
        redirect(id: $id) {
            ...RedirectDetail
        }
    }
    ${redirectDetailFragment}
`;

export const updateRedirectMutation = gql`
    mutation UpdateRedirect($id: ID!, $lastUpdatedAt: DateTime, $input: RedirectInput!) {
        updateRedirect(id: $id, lastUpdatedAt: $lastUpdatedAt, input: $input) {
            ...RedirectDetail
        }
    }
    ${redirectDetailFragment}
`;

export const createRedirectMutation = gql`
    mutation CreateRedirect($input: RedirectInput!) {
        createRedirect(input: $input) {
            ...RedirectDetail
        }
    }
    ${redirectDetailFragment}
`;
