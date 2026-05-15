import { type DocumentNode, gql } from "@apollo/client";

import { actionLogCompareFragment } from "../actionLogCompare/ActionLogCompare";
import { actionLogGridFragment } from "../actionLogGrid/ActionLogGrid";
import { actionLogShowVersionFragment } from "../actionLogShowVersion/ActionLogShowVersion";

type ActionLogDialogQueries = {
    gridQuery: DocumentNode;
    showVersionQuery: DocumentNode;
    compareVersionsQuery: DocumentNode;
};

export function createActionLogDialogQueries(rootField: string): ActionLogDialogQueries {
    const queryNamePrefix = capitalize(rootField);

    return {
        gridQuery: gql`
            query ${queryNamePrefix}ActionLogsDialog($id: ID!, $offset: Int!, $limit: Int!, $sort: [ActionLogSort!]) {
                ${rootField}(id: $id) {
                    actionLogs(offset: $offset, limit: $limit, sort: $sort) {
                        nodes { ...ActionLogGridFragment }
                        totalCount
                    }
                }
            }
            ${actionLogGridFragment}
        `,
        showVersionQuery: gql`
            query ${queryNamePrefix}ActionLogShowVersionDialog($id: ID!, $versionId: ID!) {
                ${rootField}(id: $id) {
                    actionLog(id: $versionId) { ...ActionLogShowVersionFragment }
                }
            }
            ${actionLogShowVersionFragment}
        `,
        compareVersionsQuery: gql`
            query ${queryNamePrefix}ActionLogCompareDialog($id: ID!, $beforeId: ID!, $afterId: ID!) {
                ${rootField}(id: $id) {
                    beforeVersion: actionLog(id: $beforeId) { ...ActionLogCompareFragment }
                    afterVersion: actionLog(id: $afterId) { ...ActionLogCompareFragment }
                }
            }
            ${actionLogCompareFragment}
        `,
    };
}

function capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
