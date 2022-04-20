import { gql } from "@apollo/client";

export const damFileDetailFragment = gql`
    fragment DamFileDetail on DamFile {
        id
        folder {
            id
        }
        name
        size
        mimetype
        archived
        contentHash
        title
        altText
        image {
            width
            height
            cropArea {
                focalPoint
                width
                height
                x
                y
            }
            exif
        }
        fileUrl
    }
`;

export const damFileDetailQuery = gql`
    query DamFileDetail($id: ID!) {
        damFile(id: $id) {
            ...DamFileDetail
        }
    }
    ${damFileDetailFragment}
`;

export const updateDamFileMutation = gql`
    mutation UpdateFile($id: ID!, $input: UpdateDamFileInput!) {
        updateDamFile(id: $id, input: $input) {
            ...DamFileDetail
        }
    }
    ${damFileDetailFragment}
`;

export const archiveDamFileMutation = gql`
    mutation ArchiveFile($id: ID!) {
        archiveDamFile(id: $id) {
            ...DamFileDetail
        }
    }
    ${damFileDetailFragment}
`;

export const restoreDamFileMutation = gql`
    mutation RestoreFile($id: ID!) {
        restoreDamFile(id: $id) {
            ...DamFileDetail
        }
    }
    ${damFileDetailFragment}
`;
