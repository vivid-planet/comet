import { gql } from "@apollo/client";

export const damBulkFilenameAlreadyExistsQuery = gql`
    query DamBulkFilenameAlreadyExists($filenames: [FilenameInput!]!) {
        filenamesResponse: damBulkFilenameAlreadyExists(filenames: $filenames) {
            name
            folderId
            isOccupied
        }
    }
`;
