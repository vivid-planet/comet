import { gql } from "@apollo/client";

import { damFileThumbnailFragment } from "../../dam/DataGrid/thumbnail/DamThumbnail";

const damFileFieldFragment = gql`
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
`;

export const damFileFieldFileQuery = gql`
    query DamFileFieldFile($id: ID!) {
        damFile(id: $id) {
            ...DamFileFieldFile
        }
    }
    ${damFileFieldFragment}
`;

export const damMultiFileFieldFragment = gql`
    fragment DamMultiFileFieldFile on DamFile {
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
        }
        fileUrl
    }
    ${damFileThumbnailFragment}
`;

export const damMultiFileFieldFileQuery = gql`
    query DamMultiFileFieldFile($id: ID!) {
        damFile(id: $id) {
            ...DamMultiFileFieldFile
        }
    }
    ${damMultiFileFieldFragment}
`;
