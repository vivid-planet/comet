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
        license {
            type
            details
            author
            durationFrom
            durationTo
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
