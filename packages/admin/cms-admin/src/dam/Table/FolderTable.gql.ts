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

export const damListQuery = gql`
    query DamList(
        $folderId: ID
        $includeArchived: Boolean
        $fileFilter: FileFilterInput
        $folderFilter: FolderFilterInput
        $sortColumnName: String
        $sortDirection: SortDirection
    ) {
        damFilesList(
            folderId: $folderId
            includeArchived: $includeArchived
            filter: $fileFilter
            sortColumnName: $sortColumnName
            sortDirection: $sortDirection
        ) {
            ...DamFileTable
        }
        damFoldersList(parentId: $folderId, filter: $folderFilter, sortColumnName: $sortColumnName, sortDirection: $sortDirection) {
            ...DamFolderTable
        }
    }
    ${damFileTableFragment}
    ${damFolderTableFragment}
`;
