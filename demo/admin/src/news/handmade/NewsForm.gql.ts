import { gql } from "@apollo/client";

export const newsFormFragment = gql`
    fragment NewsForm on News {
        slug
        title
        status
        date
        category
        image
        content
    }
`;

export const newsFormQuery = gql`
    query NewsForm($id: ID!) {
        news(id: $id) {
            id
            updatedAt
            ...NewsForm
        }
    }
    ${newsFormFragment}
`;

export const newsFormCheckForChangesQuery = gql`
    query NewsFormCheckForChanges($id: ID!) {
        news(id: $id) {
            updatedAt
        }
    }
`;

export const createNewsMutation = gql`
    mutation CreateNews($scope: NewsContentScopeInput!, $input: NewsInput!) {
        createNews(scope: $scope, input: $input) {
            id
            updatedAt
            ...NewsForm
        }
    }
    ${newsFormFragment}
`;

export const updateNewsMutation = gql`
    mutation UpdateNews($id: ID!, $input: NewsUpdateInput!) {
        updateNews(id: $id, input: $input) {
            id
            updatedAt
            ...NewsForm
        }
    }
    ${newsFormFragment}
`;
