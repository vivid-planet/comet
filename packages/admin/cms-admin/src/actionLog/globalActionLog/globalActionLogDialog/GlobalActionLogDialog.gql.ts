import { gql } from "@apollo/client";

import { actionLogVersionGridFragment } from "../../actionLog/actionLogVersionGrid/ActionLogVersionGrid";
import { actionLogCompareFragment } from "../../components/actionLogCompare/ActionLogCompare";

export const globalActionLogDialogGridQuery = gql`
    query GlobalActionLogDialogGrid($filter: ActionLogFilter!, $offset: Int!, $limit: Int!, $sort: [ActionLogSort!], $scopes: [JSONObject!]!) {
        actionLogs(filter: $filter, offset: $offset, limit: $limit, sort: $sort, scopes: $scopes) {
            nodes {
                ...ActionLogVersionGrid
            }
            totalCount
        }
    }
    ${actionLogVersionGridFragment}
`;

export const globalActionLogDialogShowVersionQuery = gql`
    query GlobalActionLogDialogShowVersion($id: ID!) {
        actionLog(id: $id) {
            ...ActionLogCompare
            previousVersion {
                ...ActionLogCompare
            }
        }
    }
    ${actionLogCompareFragment}
`;

export const globalActionLogDialogCompareQuery = gql`
    query GlobalActionLogDialogCompare($beforeId: ID!, $afterId: ID!) {
        beforeVersion: actionLog(id: $beforeId) {
            ...ActionLogCompare
        }
        afterVersion: actionLog(id: $afterId) {
            ...ActionLogCompare
        }
    }
    ${actionLogCompareFragment}
`;
