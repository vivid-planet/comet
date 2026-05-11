import { gql } from "@apollo/client";

import { damFileThumbnailFragment } from "../../dam/DataGrid/thumbnail/DamThumbnail";

export const damFileFieldFragment = gql`
    fragment DamFileFieldFile on DamFile {
        id
        name
        size
        mimetype
        contentHash
        title
        altText
        archived
        image {
            ...DamFileThumbnail
            width
            height
            cropArea {
                focalPoint
                width
                height
                x
                y
            }
        }
        fileUrl
    }
    ${damFileThumbnailFragment}
`;

export const damFileFieldFileQuery = gql`
    query DamFileFieldFile($id: ID!) {
        damFile(id: $id) {
            ...DamFileFieldFile
        }
    }
    ${damFileFieldFragment}
`;

export const damFileFieldFilesByIdsQuery = gql`
    query DamFileFieldFilesByIds($ids: [ID!]!, $limit: Int!, $scope: DamScopeInput!) {
        damFilesList(filter: { ids: $ids }, limit: $limit, includeArchived: true, scope: $scope) {
            nodes {
                ...DamFileFieldFile
            }
        }
    }
    ${damFileFieldFragment}
`;
