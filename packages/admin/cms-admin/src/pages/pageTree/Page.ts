import { gql } from "@apollo/client";

export type { GQLDeletePageTreeNodeMutation, GQLDeletePageTreeNodeMutationVariables } from "./Page.generated";

export const deletePageMutation = gql`
    mutation DeletePageTreeNode($id: ID!) {
        deletePageTreeNode(id: $id)
    }
`;
