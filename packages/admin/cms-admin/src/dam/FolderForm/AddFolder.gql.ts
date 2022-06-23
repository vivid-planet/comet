import { gql } from "@apollo/client/core";

export const createDamFolderMutation = gql`
    mutation CreateDamFolder($input: CreateDamFolderInput!) {
        createDamFolder(input: $input) {
            id
            name
            mpath
        }
    }
`;
