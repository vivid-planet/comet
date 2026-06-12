import { gql } from "@apollo/client";

import { actionLogCompareFragment } from "../../actionLogCompare/ActionLogCompare";
import { actionLogGridFragment } from "../../actionLogGrid/ActionLogGrid";

export const actionLogsDialogGridQuery = gql`
    query ActionLogsDialogGrid($filter: ActionLogFilter!, $offset: Int!, $limit: Int!, $sort: [ActionLogSort!], $scopes: [JSONObject!]!) {
        actionLogs(filter: $filter, offset: $offset, limit: $limit, sort: $sort, scopes: $scopes) {
            nodes {
                ...ActionLogGrid
            }
            totalCount
        }
    }
    ${actionLogGridFragment}
`;

export const actionLogsDialogShowVersionQuery = gql`
    query ActionLogsDialogShowVersion($id: ID!) {
        actionLog(id: $id) {
            ...ActionLogCompare
            previousVersion {
                ...ActionLogCompare
            }
        }
    }
    ${actionLogCompareFragment}
`;

export const actionLogsDialogCompareQuery = gql`
    query ActionLogsDialogCompare($beforeId: ID!, $afterId: ID!) {
        beforeVersion: actionLog(id: $beforeId) {
            ...ActionLogCompare
        }
        afterVersion: actionLog(id: $afterId) {
            ...ActionLogCompare
        }
    }
    ${actionLogCompareFragment}
`;
