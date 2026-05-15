import { gql } from "@apollo/client";

export const actionLogShowVersionFragment = gql`
    fragment ActionLogShowVersionFragment on ActionLog {
        id
        version
        snapshot
        createdAt
        userId
        entityName
    }
`;
