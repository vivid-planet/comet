import { gql } from "graphql-request";

export const deletePageTreeNodeMutation = gql`
    mutation DeleteNode($id: ID!) {
        deletePageTreeNode(id: $id)
    }
`;
