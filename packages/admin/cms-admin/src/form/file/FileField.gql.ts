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

// SVG-tolerant fragment used by FileField multi mode: omits the pixel-image-only
// fields (`width`, `height`, `cropArea`) so the query doesn't fail on DAM file
// rows whose `DamFileImage` lacks pixel dimensions (e.g. SVGs, or images
// imported without dimension extraction). The remaining fields match the
// single-file fragment minus those three and are sufficient for FileFieldRow
// (thumbnail + name + path) and for any consumer that just needs to identify
// or list files.
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
