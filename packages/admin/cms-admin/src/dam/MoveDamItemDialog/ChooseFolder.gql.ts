import { gql } from "@apollo/client";

export const foldersQuery = gql`
    query ChooseFolderFolders($parentId: ID, $searchText: String) {
        damFolders(parentId: $parentId, filter: { searchText: $searchText }, sortColumnName: "name") {
            id
            name
            numberOfChildFolders
            parent {
                id
            }
        }
    }
`;
