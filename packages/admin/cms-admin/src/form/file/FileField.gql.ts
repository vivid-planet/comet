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

// Lean fragment for list rendering — omits image-editor-only fields
// (`width`, `height`, `cropArea`) which `FileFieldRow` doesn't render and
// consumers like list blocks don't need. Reduces payload when picking many
// files at once.
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
