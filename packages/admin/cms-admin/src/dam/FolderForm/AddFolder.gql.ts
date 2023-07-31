import { gql } from "@apollo/client/core";

export const createDamFolderMutation = gql`
    mutation CreateDamFolder($input: CreateDamFolderInput!, $scope: DamScopeInput!) {
        createDamFolder(input: $input, scope: $scope) {
            id
            name
            mpath
        }
    }
`;
