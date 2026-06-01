import { gql } from "graphql-request";

export const listPageTreeNodesQuery = gql`
    query ListNodes($scope: PageTreeNodeScopeInput!, $category: String, $documentType: String) {
        paginatedPageTreeNodes(scope: $scope, category: $category, documentType: $documentType, limit: 100, offset: 0) {
            nodes {
                id
                name
                slug
                path
                visibility
                documentType
                parentId
                category
                hideInMenu
                pos
            }
            totalCount
        }
    }
`;
