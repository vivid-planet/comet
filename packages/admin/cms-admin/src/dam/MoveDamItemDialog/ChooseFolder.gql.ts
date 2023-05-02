import { gql } from "@apollo/client";

export const allFoldersQuery = gql`
    query AllFoldersWithoutFilters($scope: DamScopeInput!) {
        damFoldersFlat(scope: $scope) {
            id
            name
            mpath
            parent {
                id
            }
        }
    }
`;
