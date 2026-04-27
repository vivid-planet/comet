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
