import { gql } from "graphql-request";

export const createPageTreeNodeMutation = gql`
    mutation CreateNode($input: PageTreeNodeCreateInput!, $scope: PageTreeNodeScopeInput!, $category: String!) {
        createPageTreeNode(input: $input, scope: $scope, category: $category) {
            id
            name
            slug
            path
            visibility
            documentType
            parentId
            category
            document {
                __typename
                ... on Page {
                    id
                }
                ... on Link {
                    id
                }
            }
        }
    }
`;
