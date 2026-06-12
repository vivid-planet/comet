import { gql } from "@apollo/client";

export const actionLogsGridFragment = gql`
    fragment ActionLogsGrid on ActionLog {
        id
        user {
            id
            name
        }
        entityName
        entityId
        version
        action
        createdAt
        scope
        snapshot
        previousVersion {
            snapshot
        }
    }
`;

export const actionLogsGridQuery = gql`
    query ActionLogsGrid($offset: Int!, $limit: Int!, $sort: [ActionLogSort!], $filter: ActionLogFilter, $scopes: [JSONObject!]!) {
        actionLogs(offset: $offset, limit: $limit, sort: $sort, filter: $filter, scopes: $scopes) {
            nodes {
                ...ActionLogsGrid
            }
            totalCount
        }
    }
    ${actionLogsGridFragment}
`;
