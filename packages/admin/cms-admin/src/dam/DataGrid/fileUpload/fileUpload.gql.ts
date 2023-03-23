import { gql } from "@apollo/client";

export const damFolderByNameAndParentId = gql`
    query DamFolderByNameAndParentId($name: String!, $parentId: ID, $scope: DamScopeInput!) {
        damFolder: damFolderByNameAndParentId(name: $name, parentId: $parentId, scope: $scope) {
            id
        }
    }
`;

export const createDamFolderForFolderUpload = gql`
    mutation DamFolderForFolderUpload($name: String!, $parentId: ID, $scope: DamScopeInput!) {
        createDamFolder(input: { name: $name, parentId: $parentId }, scope: $scope) {
            id
        }
    }
`;
