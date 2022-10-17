import { gql } from "@apollo/client";

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
        damPath
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
