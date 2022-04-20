import { gql } from "@apollo/client";

export const redirectDetailFragment = gql`
    fragment RedirectDetail on Redirect {
        id
        sourceType
        source
        targetType
        targetUrl
        targetPageId
        comment
        generationType
        targetPage {
            id
            name
            slug
        }
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
    mutation UpdateRedirect($id: ID!, $lastUpdatedAt: DateTime, $input: UpdateRedirectInput!) {
        updateRedirect(id: $id, lastUpdatedAt: $lastUpdatedAt, input: $input) {
            ...RedirectDetail
        }
    }
    ${redirectDetailFragment}
`;

export const createRedirectMutation = gql`
    mutation CreateRedirect($input: CreateRedirectInput!) {
        createRedirect(input: $input) {
            ...RedirectDetail
        }
    }
    ${redirectDetailFragment}
`;
