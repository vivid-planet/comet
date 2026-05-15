import { useQuery } from "@apollo/client";
import { muiGridSortToGql, useDataGridRemote, usePersistentColumnState } from "@comet/admin";
import { type ComponentType, useCallback, useMemo, useState } from "react";

import type { GQLActionLogCompareFragmentFragment } from "../actionLogCompare/ActionLogCompare.gql.generated";
import type { GQLActionLogGridFragmentFragment } from "../actionLogGrid/ActionLogGrid.gql.generated";
import type { GQLActionLogShowVersionFragmentFragment } from "../actionLogShowVersion/ActionLogShowVersion.gql.generated";
import { ActionLogDialog as ActionLogDialogComponent, type ActionLogDialogValue } from "./ActionLogDialog";
import { createActionLogDialogQueries } from "./createActionLogDialogQueries";

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

type ActionLogDialogApi = {
    openActionLogDialog: () => void;
    closeActionLogDialog: () => void;
};

export function useActionLogDialog({ rootField, id, name, columnStateStorageKey }: UseActionLogDialogOptions): [ComponentType, ActionLogDialogApi] {
    const [open, setOpen] = useState(false);
    const [view, setView] = useState<DialogView>({ type: "grid" });

    const dataGridRemote = useDataGridRemote({ initialSort: [{ field: "version", sort: "desc" }] });
    const persistentColumnState = usePersistentColumnState(columnStateStorageKey ?? `${rootField}ActionLogDialogGrid`);

    const queries = useMemo(() => createActionLogDialogQueries(rootField), [rootField]);

    const gridResult = useQuery<EntityActionLogsResult>(queries.gridQuery, {
        skip: !open || view.type !== "grid",
        variables: {
            id,
            offset: dataGridRemote.paginationModel.page * dataGridRemote.paginationModel.pageSize,
            limit: dataGridRemote.paginationModel.pageSize,
            sort: muiGridSortToGql(dataGridRemote.sortModel) ?? [],
        },
    });

    const showVersionResult = useQuery<EntityActionLogsResult>(queries.showVersionQuery, {
        skip: !open || view.type !== "showVersion",
        variables: view.type === "showVersion" ? { id, versionId: view.versionId } : undefined,
    });

    const compareVersionsResult = useQuery<EntityActionLogsResult>(queries.compareVersionsQuery, {
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

    const openActionLogDialog = useCallback(() => setOpen(true), []);
    const closeActionLogDialog = useCallback(() => {
        setOpen(false);
        setView({ type: "grid" });
    }, []);

    const api = useMemo<ActionLogDialogApi>(() => ({ openActionLogDialog, closeActionLogDialog }), [openActionLogDialog, closeActionLogDialog]);

    const ActionLogDialog = useMemo<ComponentType>(
        () => () => (
            <ActionLogDialogComponent
                id={id}
                name={name}
                open={open}
                value={value}
                onClose={closeActionLogDialog}
                onShowVersionClick={(versionId) => setView({ type: "showVersion", versionId })}
                onCompareVersionsClick={(beforeId, afterId) => setView({ type: "compareVersions", beforeId, afterId })}
                onShowVersionHistoryClick={() => setView({ type: "grid" })}
            />
        ),
        [id, name, open, value, closeActionLogDialog],
    );

    return [ActionLogDialog, api];
}
