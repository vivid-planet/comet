import { gql } from "@apollo/client";

export const damFolderByNameAndParentId = gql`
    query DamFolderByNameAndParentId($name: String!, $parentId: ID) {
        damFolder: damFolderByNameAndParentId(name: $name, parentId: $parentId) {
            id
        }
    }
`;

export const createDamFolderForFolderUpload = gql`
    mutation DamFolderForFolderUpload($name: String!, $parentId: ID) {
        createDamFolder(input: { name: $name, parentId: $parentId }) {
            id
        }
    }
`;
