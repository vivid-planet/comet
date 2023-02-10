import { gql } from "@apollo/client";

export const allFoldersQuery = gql`
    query AllFoldersWithoutFilters {
        damFoldersWithoutFilters {
            id
            name
            mpath
            numberOfChildFolders
            parent {
                id
            }
        }
    }
`;
