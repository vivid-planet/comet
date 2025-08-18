import { gql } from "@apollo/client";

export const actionLogShowVersionQuery = gql`
    query ActionLogShowVersion($offset: Int!, $limit: Int!, $sort: [ActionLogSort!], $filter: ActionLogFilter) {
        actionLogs(offset: $offset, limit: $limit, sort: $sort, filter: $filter) {
            totalCount
            nodes {
                ...ActionLogActionLogShowVersionFragment
            }
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
