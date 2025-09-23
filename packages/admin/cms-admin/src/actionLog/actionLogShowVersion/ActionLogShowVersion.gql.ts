import { gql } from "@apollo/client";

export const actionLogShowVersionQuery = gql`
    query ActionLogShowVersion($id: ID!) {
        actionLog(id: $id) {
            ...ActionLogActionLogShowVersionFragment
        }
    }

    fragment ActionLogActionLogShowVersionFragment on ActionLog {
        id
        version
        snapshot
        createdAt
        userId
        entityName
    }
`;
