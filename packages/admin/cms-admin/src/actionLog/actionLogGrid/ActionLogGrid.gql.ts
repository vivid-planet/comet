import { gql } from "@apollo/client";

export const actionLogGridFragment = gql`
    fragment ActionLogGrid on ActionLog {
        id
        userId
        entityName
        version
        createdAt
    }
`;
