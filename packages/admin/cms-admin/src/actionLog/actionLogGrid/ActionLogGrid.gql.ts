import { gql } from "@apollo/client";

export const actionLogGridFragment = gql`
    fragment ActionLogGrid on ActionLog {
        id
        userId
        user {
            id
            name
        }
        entityName
        version
        createdAt
    }
`;
