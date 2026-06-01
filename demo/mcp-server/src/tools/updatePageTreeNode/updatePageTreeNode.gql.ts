import { gql } from "graphql-request";

export const updatePageTreeNodeMutation = gql`
    mutation UpdateNode($id: ID!, $input: PageTreeNodeUpdateInput!) {
        updatePageTreeNode(id: $id, input: $input) {
            id
            name
            slug
            path
            visibility
            hideInMenu
        }
    }
`;
