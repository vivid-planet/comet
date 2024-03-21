import { gql } from "@apollo/client";

export { GQLDeletePageTreeNodeMutation, GQLDeletePageTreeNodeMutationVariables } from "./Page.generated";

export const deletePageMutation = gql`
    mutation DeletePageTreeNode($id: ID!) {
        deletePageTreeNode(id: $id)
    }
`;
