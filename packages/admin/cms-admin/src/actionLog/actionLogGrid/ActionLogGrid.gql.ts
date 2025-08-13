import { gql } from "@apollo/client";

export const actionLogGridQuery = gql`
    query ActionLogGrid($offset: Int!, $limit: Int!, $sort: [ActionLogSort!], $filter: ActionLogFilter) {
        actionLogs(offset: $offset, limit: $limit, sort: $sort, filter: $filter) {
            totalCount
            nodes {
                ...ActionLogGridFragment
            }
        }
    }
    fragment ActionLogGridFragment on ActionLog {
        id
        userId
        entityName
        version
        createdAt
    }
`;
