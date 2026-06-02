import { gql } from "graphql-request";

export const listDamFilesQuery = gql`
    query ListDamFiles(
        $scope: DamScopeInput!
        $folderId: ID
        $filter: FileFilterInput
        $limit: Int
        $offset: Int
        $sortColumnName: String
        $sortDirection: SortDirection
    ) {
        damFilesList(
            scope: $scope
            folderId: $folderId
            filter: $filter
            limit: $limit
            offset: $offset
            sortColumnName: $sortColumnName
            sortDirection: $sortDirection
        ) {
            nodes {
                id
                name
                size
                mimetype
                contentHash
                title
                altText
                archived
                fileUrl
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
            totalCount
        }
    }
`;
