import { gql } from "@apollo/client/core";

export const editFolderQuery = gql`
    query EditFolder($id: ID!) {
        damFolder(id: $id) {
            id
            name
        }
    }
`;
