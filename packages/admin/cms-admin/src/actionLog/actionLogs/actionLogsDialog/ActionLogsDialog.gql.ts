import { gql } from "@apollo/client";

import { actionLogGridFragment } from "../../actionLogGrid/ActionLogGrid";
import { actionLogCompareFragment } from "../../components/actionLogCompare/ActionLogCompare";

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
