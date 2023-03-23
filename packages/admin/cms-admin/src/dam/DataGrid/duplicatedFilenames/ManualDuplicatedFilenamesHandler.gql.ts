import { gql } from "@apollo/client";

export const damAreFilenamesOccupied = gql`
    query DamAreFilenamesOccupied($filenames: [FilenameInput!]!, $scope: DamScopeInput!) {
        filenamesResponse: damAreFilenamesOccupied(filenames: $filenames, scope: $scope) {
            name
            folderId
            isOccupied
        }
    }
`;
