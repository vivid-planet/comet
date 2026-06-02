import { gql } from "graphql-request";

export const getDamFileQuery = gql`
    query GetDamFile($id: ID!) {
        damFile(id: $id) {
            id
            name
            size
            mimetype
            contentHash
            title
            altText
            archived
            fileUrl
            damPath
            image {
                width
                height
                dominantColor
                cropArea {
                    focalPoint
                    width
                    height
                    x
                    y
                }
            }
            folder {
                id
                name
            }
            createdAt
            updatedAt
        }
    }
`;
