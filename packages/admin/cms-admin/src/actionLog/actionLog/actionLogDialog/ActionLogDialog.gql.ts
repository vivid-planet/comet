import { gql } from "@apollo/client";
import type { DocumentNode } from "graphql";

import { actionLogCompareFragment } from "../../components/actionLogCompare/ActionLogCompare";
import type { GQLActionLogCompareFragment } from "../../components/actionLogCompare/ActionLogCompare.gql.generated";
import { actionLogShowVersionFragment } from "../../components/actionLogShowVersion/ActionLogShowVersion";
import type { GQLActionLogShowVersionFragment } from "../../components/actionLogShowVersion/ActionLogShowVersion.gql.generated";
import { actionLogVersionGridFragment } from "../actionLogVersionGrid/ActionLogVersionGrid";
import type { GQLActionLogVersionGridFragment } from "../actionLogVersionGrid/ActionLogVersionGrid.gql.generated";

export type ActionLogDialogGridQueryResult = {
    entity: { actionLogs: { nodes: GQLActionLogVersionGridFragment[]; totalCount: number } } | null;
};

export type ActionLogDialogGridQueryVariables = {
    id: string;
    offset: number;
    limit: number;
    sort: Array<{ field: string; direction: "ASC" | "DESC" }>;
};

export type ActionLogDialogShowVersionQueryResult = {
    entity: { actionLog: GQLActionLogShowVersionFragment | null } | null;
};

export type ActionLogDialogShowVersionQueryVariables = {
    id: string;
    versionId: string;
};

export type ActionLogDialogCompareQueryResult = {
    entity: {
        beforeVersion: GQLActionLogCompareFragment | null;
        afterVersion: GQLActionLogCompareFragment | null;
    } | null;
};

export type ActionLogDialogCompareQueryVariables = {
    id: string;
    beforeVersionId: string;
    afterVersionId: string;
};

export type ActionLogDialogRestoreMutationResult = {
    restore: { id: string };
};

export type ActionLogDialogRestoreMutationVariables = {
    id: string;
    actionLogId: string;
};

export const createActionLogDialogGridQuery = (rootField: string): DocumentNode => gql`
    query ActionLogDialogGrid($id: ID!, $offset: Int!, $limit: Int!, $sort: [ActionLogSort!]) {
        entity: ${rootField}(id: $id) {
            actionLogs(offset: $offset, limit: $limit, sort: $sort) {
                nodes {
                    ...ActionLogVersionGrid
                }
                totalCount
            }
        }
    }
    ${actionLogVersionGridFragment}
`;

export const createActionLogDialogShowVersionQuery = (rootField: string): DocumentNode => gql`
    query ActionLogDialogShowVersion($id: ID!, $versionId: ID!) {
        entity: ${rootField}(id: $id) {
            actionLog(id: $versionId) {
                ...ActionLogShowVersion
            }
        }
    }
    ${actionLogShowVersionFragment}
`;

export const createActionLogDialogCompareQuery = (rootField: string): DocumentNode => gql`
    query ActionLogDialogCompare($id: ID!, $beforeVersionId: ID!, $afterVersionId: ID!) {
        entity: ${rootField}(id: $id) {
            beforeVersion: actionLog(id: $beforeVersionId) {
                ...ActionLogCompare
            }
            afterVersion: actionLog(id: $afterVersionId) {
                ...ActionLogCompare
            }
        }
    }
    ${actionLogCompareFragment}
`;

/**
 * The restore mutation is named `restore<EntityName>` on the API (e.g. `restoreManufacturer`).
 * It is derived from the `rootField`, which exposes the same entity (e.g. `manufacturer`).
 */
export const createActionLogDialogRestoreMutation = (rootField: string): DocumentNode => {
    const mutationName = `restore${rootField.charAt(0).toUpperCase()}${rootField.slice(1)}`;
    return gql`
        mutation ActionLogDialogRestore($id: ID!, $actionLogId: ID!) {
            restore: ${mutationName}(id: $id, actionLogId: $actionLogId) {
                id
            }
        }
    `;
};
