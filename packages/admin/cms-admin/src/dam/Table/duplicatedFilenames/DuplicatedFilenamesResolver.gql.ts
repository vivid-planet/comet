import { gql } from "@apollo/client";

export const damAreFilenamesOccupied = gql`
    query DamAreFilenamesOccupied($filenames: [FilenameInput!]!) {
        filenamesResponse: damAreFilenamesOccupied(filenames: $filenames) {
            name
            folderId
            isOccupied
        }
    }
`;
