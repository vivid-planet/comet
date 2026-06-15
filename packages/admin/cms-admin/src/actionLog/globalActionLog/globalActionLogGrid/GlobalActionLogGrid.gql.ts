import { gql } from "@apollo/client";

export const globalActionLogGridFragment = gql`
    fragment GlobalActionLogGrid on ActionLog {
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

export const globalActionLogGridQuery = gql`
    query GlobalActionLogGrid($offset: Int!, $limit: Int!, $sort: [ActionLogSort!], $filter: ActionLogFilter, $scopes: [JSONObject!]!) {
        actionLogs(offset: $offset, limit: $limit, sort: $sort, filter: $filter, scopes: $scopes) {
            nodes {
                ...GlobalActionLogGrid
            }
            totalCount
        }
    }
    ${globalActionLogGridFragment}
`;
