import { gql } from "@apollo/client";

export const deletePageMutation = gql`
    mutation DeletePageTreeNode($id: ID!) {
        deletePageTreeNode(id: $id)
    }
`;
