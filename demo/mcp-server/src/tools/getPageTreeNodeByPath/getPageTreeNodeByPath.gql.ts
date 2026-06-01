import { gql } from "graphql-request";

export const getPageTreeNodeByPathQuery = gql`
    query GetNodeByPath($path: String!, $scope: PageTreeNodeScopeInput!) {
        pageTreeNodeByPath(path: $path, scope: $scope) {
            id
            name
            slug
            path
            visibility
            documentType
            parentId
            category
            hideInMenu
            childNodes {
                id
                name
                slug
                path
                visibility
                documentType
            }
            document {
                __typename
                ... on Page {
                    id
                }
                ... on Link {
                    id
                }
            }
            scope {
                domain
                language
            }
        }
    }
`;
