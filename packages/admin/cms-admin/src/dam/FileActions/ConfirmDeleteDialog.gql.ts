import { gql } from "@apollo/client";

export const deleteDamFileMutation = gql`
    mutation DeleteDamFile($id: ID!) {
        deleteDamFile(id: $id)
    }
`;
