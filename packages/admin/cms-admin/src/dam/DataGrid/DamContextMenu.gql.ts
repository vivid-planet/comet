import { gql } from "@apollo/client";

export const deleteDamFileMutation = gql`
    mutation DeleteDamFile($id: ID!) {
        deleteDamFile(id: $id)
    }
`;

export const archiveDamFileMutation = gql`
    mutation ArchiveFile($id: ID!) {
        archiveDamFile(id: $id) {
            id
            archived
        }
    }
`;

export const restoreDamFileMutation = gql`
    mutation RestoreFile($id: ID!) {
        restoreDamFile(id: $id) {
            id
            archived
        }
    }
`;
