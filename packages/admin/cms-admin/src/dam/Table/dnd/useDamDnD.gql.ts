import { gql } from "@apollo/client";

export const moveDamFilesMutation = gql`
    mutation MoveDamFiles($fileIds: [ID!]!, $targetFolderId: ID) {
        moveDamFiles(fileIds: $fileIds, targetFolderId: $targetFolderId) {
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
