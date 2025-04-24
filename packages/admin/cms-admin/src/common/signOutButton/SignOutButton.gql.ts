import { gql } from "@apollo/client";

export const signOutMutation = gql`
    mutation SignOut {
        currentUserSignOut
    }
`;
