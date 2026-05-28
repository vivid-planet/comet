import { gql } from "@apollo/client";

export const actionLogCompareFragment = gql`
    fragment ActionLogCompare on ActionLog {
        id
        version
        snapshot
        createdAt
        userId
        user {
            id
            name
        }
        entityName
    }
`;
