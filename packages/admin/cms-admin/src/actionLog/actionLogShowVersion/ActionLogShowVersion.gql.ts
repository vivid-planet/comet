import { gql } from "@apollo/client";

export const actionLogShowVersionFragment = gql`
    fragment ActionLogShowVersion on ActionLog {
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
