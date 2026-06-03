import { gql } from "@apollo/client";

export const actionLogGridFragment = gql`
    fragment ActionLogGrid on ActionLog {
        id
        user {
            id
            name
        }
        entityName
        version
        createdAt
    }
`;
