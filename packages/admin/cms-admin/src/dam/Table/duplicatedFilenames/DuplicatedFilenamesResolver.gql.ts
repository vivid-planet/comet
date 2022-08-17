import { gql } from "@apollo/client";

export const damFindAlternativesToDuplicatedFilenamesQuery = gql`
    query DamFindAlternativesToDuplicatedFilenames($filenames: [FilenameInput!]!) {
        alternatives: findAlternativesToDuplicatedFilenames(filenames: $filenames) {
            originalName
            folderId
            isOccupied
            alternativeName
            extension
        }
    }
`;
