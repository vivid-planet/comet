import { gql } from "graphql-request";

export const updatePageTreeNodeVisibilityMutation = gql`
    mutation UpdateVisibility($id: ID!, $input: PageTreeNodeUpdateVisibilityInput!) {
        updatePageTreeNodeVisibility(id: $id, input: $input) {
            id
            name
            slug
            path
            visibility
        }
    }
`;
