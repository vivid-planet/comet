import { gql } from "@apollo/client";

export const damFolderMPathFragment = gql`
    fragment DamFolderMPath on DamFolder {
        id
        mpath
    }
`;

export const damFolderMPathQuery = gql`
    query DamFolderMPath($id: ID!) {
        damFolder(id: $id) {
            ...DamFolderMPath
        }
    }
    ${damFolderMPathFragment}
`;
