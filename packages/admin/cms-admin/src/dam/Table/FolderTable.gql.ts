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

export const damFilesListQuery = gql`
    query DamFilesList($folderId: ID, $includeArchived: Boolean, $fileFilter: FileFilterInput, $sort: SortInput) {
        damFilesList(folderId: $folderId, includeArchived: $includeArchived, filter: $fileFilter, sort: $sort) {
            ...DamFileTable
        }
    }
    ${damFileTableFragment}
`;

export const damFoldersListQuery = gql`
    query DamFoldersList($parentId: ID, $folderFilter: FolderFilterInput, $sort: SortInput) {
        damFoldersList(parentId: $parentId, filter: $folderFilter, sort: $sort) {
            ...DamFolderTable
        }
    }
    ${damFolderTableFragment}
`;

export const updateDamFolderMutation = gql`
    mutation UpdateDamFolder($id: ID!, $input: UpdateDamFolderInput!) {
        updateDamFolder(id: $id, input: $input) {
            ...DamFolderTable
        }
    }
    ${damFolderTableFragment}
`;

export const updateDamFileMutation = gql`
    mutation UpdateDamFile($id: ID!, $input: UpdateDamFileInput!) {
        updateDamFile(id: $id, input: $input) {
            id
            name
            size
            mimetype
            updatedAt
        }
    }
`;
