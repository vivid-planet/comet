import { gql } from "@apollo/client";
import type { DocumentNode } from "graphql";

import { actionLogCompareFragment } from "../actionLogCompare/ActionLogCompare";
import type { GQLActionLogCompareFragmentFragment } from "../actionLogCompare/ActionLogCompare.gql.generated";
import { actionLogGridFragment } from "../actionLogGrid/ActionLogGrid";
import type { GQLActionLogGridFragmentFragment } from "../actionLogGrid/ActionLogGrid.gql.generated";
import { actionLogShowVersionFragment } from "../actionLogShowVersion/ActionLogShowVersion";
import type { GQLActionLogShowVersionFragmentFragment } from "../actionLogShowVersion/ActionLogShowVersion.gql.generated";

export type ActionLogDialogGridQueryResult = {
    entity: { actionLogs: { nodes: GQLActionLogGridFragmentFragment[]; totalCount: number } } | null;
};

export type ActionLogDialogGridQueryVariables = {
    id: string;
    offset: number;
    limit: number;
    sort: Array<{ field: string; direction: "ASC" | "DESC" }>;
};

export type ActionLogDialogShowVersionQueryResult = {
    entity: { actionLog: GQLActionLogShowVersionFragmentFragment | null } | null;
};

export type ActionLogDialogShowVersionQueryVariables = {
    id: string;
    versionId: string;
};

export type ActionLogDialogCompareQueryResult = {
    entity: {
        beforeVersion: GQLActionLogCompareFragmentFragment | null;
        afterVersion: GQLActionLogCompareFragmentFragment | null;
    } | null;
};

export type ActionLogDialogCompareQueryVariables = {
    id: string;
    beforeVersionId: string;
    afterVersionId: string;
};

export const createActionLogDialogGridQuery = (rootField: string): DocumentNode => gql`
    query ActionLogDialogGrid($id: ID!, $offset: Int!, $limit: Int!, $sort: [ActionLogSort!]) {
        entity: ${rootField}(id: $id) {
            actionLogs(offset: $offset, limit: $limit, sort: $sort) {
                nodes {
                    ...ActionLogGridFragment
                }
                totalCount
            }
        }
    }
    ${actionLogGridFragment}
`;

export const createActionLogDialogShowVersionQuery = (rootField: string): DocumentNode => gql`
    query ActionLogDialogShowVersion($id: ID!, $versionId: ID!) {
        entity: ${rootField}(id: $id) {
            actionLog(id: $versionId) {
                ...ActionLogShowVersionFragment
            }
        }
    }
    ${actionLogShowVersionFragment}
`;

export const createActionLogDialogCompareQuery = (rootField: string): DocumentNode => gql`
    query ActionLogDialogCompare($id: ID!, $beforeVersionId: ID!, $afterVersionId: ID!) {
        entity: ${rootField}(id: $id) {
            beforeVersion: actionLog(id: $beforeVersionId) {
                ...ActionLogCompareFragment
            }
            afterVersion: actionLog(id: $afterVersionId) {
                ...ActionLogCompareFragment
            }
        }
    }
    ${actionLogCompareFragment}
`;
