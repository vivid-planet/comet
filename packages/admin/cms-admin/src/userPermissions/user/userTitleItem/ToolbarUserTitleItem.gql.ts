import { gql } from "@apollo/client";

export const userTitleItemQuery = gql`
    query UserTitleItem($id: String!) {
        user: userPermissionsUserById(id: $id) {
            id
            name
            email
        }
    }
`;
