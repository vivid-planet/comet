import { gql } from "@apollo/client";

import { damFileThumbnailFragment } from "./thumbnail/DamThumbnail.gql";

export const damFileTableFragment = gql`
    fragment DamFileTable on DamFile {
        id
        name
        fileUrl
        archived
        size
        mimetype
        contentHash
        folder {
            id
            name
            parents {
                id
                name
            }
        }
        image {
            ...DamFileThumbnail
        }
        updatedAt
    }
    ${damFileThumbnailFragment}
`;

export const damFolderTableFragment = gql`
    fragment DamFolderTable on DamFolder {
        id
        name
        mpath
        parents {
            id
            name
        }
        numberOfFiles
        numberOfChildFolders
        updatedAt
    }
`;

export const damFolderQuery = gql`
    query DamFolder($id: ID!) {
        damFolder(id: $id) {
            ...DamFolderTable
        }
    }
    ${damFolderTableFragment}
`;

export const damItemsListQuery = gql`
    query DamItemsList(
        $folderId: ID
        $includeArchived: Boolean
        $filter: DamItemFilterInput
        $sortColumnName: String
        $sortDirection: SortDirection
        $offset: Int
        $limit: Int
    ) {
        damItemsList(
            folderId: $folderId
            includeArchived: $includeArchived
            filter: $filter
            sortColumnName: $sortColumnName
            sortDirection: $sortDirection
            offset: $offset
            limit: $limit
        ) {
            nodes {
                ... on DamFile {
                    ...DamFileTable
                }
                ... on DamFolder {
                    ...DamFolderTable
                }
            }
            totalCount
        }
    }
    ${damFileTableFragment}
    ${damFolderTableFragment}
`;

export const damItemListPosition = gql`
    query DamItemListPosition(
        $id: ID!
        $type: DamItemTypeLiteral!
        $folderId: ID
        $includeArchived: Boolean
        $filter: DamItemFilterInput
        $sortColumnName: String
        $sortDirection: SortDirection
    ) {
        damItemListPosition(
            id: $id
            type: $type
            args: {
                folderId: $folderId
                includeArchived: $includeArchived
                filter: $filter
                sortColumnName: $sortColumnName
                sortDirection: $sortDirection
            }
        )
    }
`;
