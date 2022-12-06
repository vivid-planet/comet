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

export const damCursorFragment = gql`
    fragment CompleteDamItemCursor on DamItemCursor {
        id
        type
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
        $first: Int
        $after: DamItemCursorInput
        $last: Int
        $before: DamItemCursorInput
    ) {
        damItemsList(
            folderId: $folderId
            includeArchived: $includeArchived
            filter: $filter
            sortColumnName: $sortColumnName
            sortDirection: $sortDirection
            first: $first
            after: $after
            last: $last
            before: $before
        ) {
            edges {
                cursor {
                    ...CompleteDamItemCursor
                }
                node {
                    ... on DamFile {
                        ...DamFileTable
                    }
                    ... on DamFolder {
                        ...DamFolderTable
                    }
                }
            }
            pageInfo {
                startCursor {
                    ...CompleteDamItemCursor
                }
                endCursor {
                    ...CompleteDamItemCursor
                }
                hasPreviousPage
                hasNextPage
            }
        }
    }
    ${damFileTableFragment}
    ${damFolderTableFragment}
    ${damCursorFragment}
`;
