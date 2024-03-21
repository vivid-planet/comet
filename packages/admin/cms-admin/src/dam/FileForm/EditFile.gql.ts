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
            expirationDate
            isNotValidYet
            expiresWithinThirtyDays
            hasExpired
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

export const damFileDependentsQuery = gql`
    query DamFileDependencies($id: ID!, $offset: Int!, $limit: Int!, $forceRefresh: Boolean = false) {
        item: damFile(id: $id) {
            id
            dependents(offset: $offset, limit: $limit, forceRefresh: $forceRefresh) {
                nodes {
                    rootGraphqlObjectType
                    rootId
                    rootColumnName
                    jsonPath
                    name
                    secondaryInformation
                }
                totalCount
            }
        }
    }
`;
