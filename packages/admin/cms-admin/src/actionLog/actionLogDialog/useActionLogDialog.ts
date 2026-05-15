import { gql, useQuery } from "@apollo/client";
import { muiGridSortToGql, useDataGridRemote, usePersistentColumnState } from "@comet/admin";
import { useCallback, useMemo, useState } from "react";

import { actionLogCompareFragment } from "../actionLogCompare/ActionLogCompare.gql";
import type { GQLActionLogCompareFragmentFragment } from "../actionLogCompare/ActionLogCompare.gql.generated";
import { actionLogGridFragment } from "../actionLogGrid/ActionLogGrid.gql";
import type { GQLActionLogGridFragmentFragment } from "../actionLogGrid/ActionLogGrid.gql.generated";
import { actionLogShowVersionFragment } from "../actionLogShowVersion/ActionLogShowVersion.gql";
import type { GQLActionLogShowVersionFragmentFragment } from "../actionLogShowVersion/ActionLogShowVersion.gql.generated";
import type { ActionLogDialogValue } from "./ActionLogDialog";

type DialogView = { type: "grid" } | { type: "showVersion"; versionId: string } | { type: "compareVersions"; beforeId: string; afterId: string };

type EntityActionLogsResult = {
    [key: string]: {
        actionLogs?: { nodes: GQLActionLogGridFragmentFragment[]; totalCount: number };
        actionLog?: GQLActionLogShowVersionFragmentFragment;
        beforeVersion?: GQLActionLogCompareFragmentFragment;
        afterVersion?: GQLActionLogCompareFragmentFragment;
    };
};

type UseActionLogDialogOptions = {
    /**
     * GraphQL root field name of the entity that exposes `actionLog`/`actionLogs`, e.g. `"manufacturer"`, `"product"`, `"news"`.
     */
    rootField: string;
    id: string;
    /**
     * Latest name of the entity, shown in the dialog title.
     */
    name?: string;
    /**
     * Storage key for the persistent grid column state. Defaults to `<rootField>ActionLogDialogGrid`.
     */
    columnStateStorageKey?: string;
};

export function useActionLogDialog({ rootField, id, name, columnStateStorageKey }: UseActionLogDialogOptions) {
    const [open, setOpen] = useState(false);
    const [view, setView] = useState<DialogView>({ type: "grid" });

    const dataGridRemote = useDataGridRemote({ initialSort: [{ field: "version", sort: "desc" }] });
    const persistentColumnState = usePersistentColumnState(columnStateStorageKey ?? `${rootField}ActionLogDialogGrid`);

    const gridQuery = useMemo(
        () => gql`
            query ${capitalize(rootField)}ActionLogsDialog($id: ID!, $offset: Int!, $limit: Int!, $sort: [ActionLogSort!]) {
                ${rootField}(id: $id) {
                    actionLogs(offset: $offset, limit: $limit, sort: $sort) {
                        nodes { ...ActionLogGridFragment }
                        totalCount
                    }
                }
            }
            ${actionLogGridFragment}
        `,
        [rootField],
    );

    const showVersionQuery = useMemo(
        () => gql`
            query ${capitalize(rootField)}ActionLogShowVersionDialog($id: ID!, $versionId: ID!) {
                ${rootField}(id: $id) {
                    actionLog(id: $versionId) { ...ActionLogShowVersionFragment }
                }
            }
            ${actionLogShowVersionFragment}
        `,
        [rootField],
    );

    const compareVersionsQuery = useMemo(
        () => gql`
            query ${capitalize(rootField)}ActionLogCompareDialog($id: ID!, $beforeId: ID!, $afterId: ID!) {
                ${rootField}(id: $id) {
                    beforeVersion: actionLog(id: $beforeId) { ...ActionLogCompareFragment }
                    afterVersion: actionLog(id: $afterId) { ...ActionLogCompareFragment }
                }
            }
            ${actionLogCompareFragment}
        `,
        [rootField],
    );

    const gridResult = useQuery<EntityActionLogsResult>(gridQuery, {
        skip: !open || view.type !== "grid",
        variables: {
            id,
            offset: dataGridRemote.paginationModel.page * dataGridRemote.paginationModel.pageSize,
            limit: dataGridRemote.paginationModel.pageSize,
            sort: muiGridSortToGql(dataGridRemote.sortModel) ?? [],
        },
    });

    const showVersionResult = useQuery<EntityActionLogsResult>(showVersionQuery, {
        skip: !open || view.type !== "showVersion",
        variables: view.type === "showVersion" ? { id, versionId: view.versionId } : undefined,
    });

    const compareVersionsResult = useQuery<EntityActionLogsResult>(compareVersionsQuery, {
        skip: !open || view.type !== "compareVersions",
        variables: view.type === "compareVersions" ? { id, beforeId: view.beforeId, afterId: view.afterId } : undefined,
    });

    const value: ActionLogDialogValue = useMemo(() => {
        if (view.type === "showVersion") {
            return {
                type: "showVersion",
                actionLog: showVersionResult.data?.[rootField]?.actionLog,
                error: !!showVersionResult.error,
                loading: showVersionResult.loading,
            };
        }
        if (view.type === "compareVersions") {
            return {
                type: "compareVersions",
                beforeVersion: compareVersionsResult.data?.[rootField]?.beforeVersion,
                afterVersion: compareVersionsResult.data?.[rootField]?.afterVersion,
                error: !!compareVersionsResult.error,
                loading: compareVersionsResult.loading,
            };
        }
        return {
            ...dataGridRemote,
            ...persistentColumnState,
            type: "grid",
            actionLogs: gridResult.data?.[rootField]?.actionLogs,
            error: !!gridResult.error,
            loading: gridResult.loading,
        };
    }, [view, dataGridRemote, persistentColumnState, gridResult, showVersionResult, compareVersionsResult, rootField]);

    const closeActionLogDialog = useCallback(() => {
        setOpen(false);
        setView({ type: "grid" });
    }, []);

    return {
        openActionLogDialog: useCallback(() => setOpen(true), []),
        closeActionLogDialog,
        dialogProps: {
            id,
            name,
            open,
            value,
            onClose: closeActionLogDialog,
            onShowVersionClick: (versionId: string) => setView({ type: "showVersion", versionId }),
            onCompareVersionsClick: (beforeId: string, afterId: string) => setView({ type: "compareVersions", beforeId, afterId }),
            onShowVersionHistoryClick: () => setView({ type: "grid" }),
        },
    };
}

function capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
