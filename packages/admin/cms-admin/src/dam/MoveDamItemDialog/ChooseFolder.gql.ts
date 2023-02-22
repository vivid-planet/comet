import { gql } from "@apollo/client";

export const allFoldersQuery = gql`
    query AllFoldersWithoutFilters {
        damFoldersFlat {
            id
            name
            mpath
            parent {
                id
            }
        }
    }
`;
