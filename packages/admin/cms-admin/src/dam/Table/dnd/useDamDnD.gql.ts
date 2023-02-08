import { gql } from "@apollo/client";

export const moveDamFilesMutation = gql`
    mutation MoveDamFiles($fileIds: [ID!]!, $targetFolderId: ID, $scope: DamScopeInput!) {
        moveDamFiles(fileIds: $fileIds, targetFolderId: $targetFolderId, scope: $scope) {
            id
        }
    }
`;

export const moveDamFoldersMutation = gql`
    mutation MoveDamFolders($folderIds: [ID!]!, $targetFolderId: ID, $scope: DamScopeInput!) {
        moveDamFolders(folderIds: $folderIds, targetFolderId: $targetFolderId, scope: $scope) {
            id
            mpath
        }
    }
`;
