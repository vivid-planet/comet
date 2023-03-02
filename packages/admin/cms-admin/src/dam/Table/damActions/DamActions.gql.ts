import { gql } from "@apollo/client";

export const deleteDamFileMutation = gql`
    mutation DeleteDamFile($id: ID!) {
        deleteDamFile(id: $id)
    }
`;

export const archiveDamFilesMutation = gql`
    mutation ArchiveFiles($ids: [ID!]!) {
        archiveDamFiles(ids: $ids) {
            id
            archived
        }
    }
`;

export const restoreDamFilesMutation = gql`
    mutation RestoreFiles($ids: [ID!]!) {
        restoreDamFiles(ids: $ids) {
            id
            archived
        }
    }
`;
