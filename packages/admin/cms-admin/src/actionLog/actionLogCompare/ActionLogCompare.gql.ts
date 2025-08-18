import { gql } from "@apollo/client";

export const actionLogCompareQuery = gql`
    query ActionLogCompare($offset: Int!, $limit: Int!, $sort: [ActionLogSort!], $filter: ActionLogFilter) {
        actionLogs(offset: $offset, limit: $limit, sort: $sort, filter: $filter) {
            totalCount
            nodes {
                ...ActionLogCompareFragment
            }
        }
    }
    fragment ActionLogCompareFragment on ActionLog {
        id
        version
        snapshot
        createdAt
        userId
        entityName
    }
`;
