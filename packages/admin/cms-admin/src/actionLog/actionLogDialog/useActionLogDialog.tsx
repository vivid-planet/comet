import { type DocumentNode, useQuery } from "@apollo/client";
import { muiGridSortToGql, useDataGridRemote, usePersistentColumnState } from "@comet/admin";
import { type ComponentType, useCallback, useMemo, useRef, useState } from "react";

import type { GQLActionLogCompareFragmentFragment } from "../actionLogCompare/ActionLogCompare.gql.generated";
import type { GQLActionLogGridFragmentFragment } from "../actionLogGrid/ActionLogGrid.gql.generated";
import type { GQLActionLogShowVersionFragmentFragment } from "../actionLogShowVersion/ActionLogShowVersion.gql.generated";
import { ActionLogDialog as ActionLogDialogComponent, type ActionLogDialogValue } from "./ActionLogDialog";

type DialogView = { type: "grid" } | { type: "showVersion"; versionId: string } | { type: "compareVersions"; beforeId: string; afterId: string };

type ActionLogsResult = { nodes: GQLActionLogGridFragmentFragment[]; totalCount: number };

type ActionLogDialogQueries<TGridData, TShowVersionData, TCompareVersionsData> = {
    grid: {
        document: DocumentNode;
        getActionLogs: (data: TGridData) => ActionLogsResult | undefined;
    };
    showVersion: {
        document: DocumentNode;
        getActionLog: (data: TShowVersionData) => GQLActionLogShowVersionFragmentFragment | undefined;
    };
    compareVersions: {
        document: DocumentNode;
        getActionLogs: (data: TCompareVersionsData) => {
            beforeVersion: GQLActionLogCompareFragmentFragment | undefined;
            afterVersion: GQLActionLogCompareFragmentFragment | undefined;
        };
    };
};

type UseActionLogDialogOptions<TGridData, TShowVersionData, TCompareVersionsData> = {
    id: string;
    /**
     * Latest name of the entity, shown in the dialog title.
     */
    name?: string;
    /**
     * The three GraphQL queries that drive the dialog, paired with accessors that read the relevant nodes out of each response.
     *
     * - `grid.document` must declare the variables `$id: ID!, $offset: Int!, $limit: Int!, $sort: [ActionLogSort!]` and select `nodes { ...ActionLogGridFragment }, totalCount`.
     * - `showVersion.document` must declare `$id: ID!, $versionId: ID!` and select `...ActionLogShowVersionFragment` on the version.
     * - `compareVersions.document` must declare `$id: ID!, $beforeId: ID!, $afterId: ID!` and select the two versions with `...ActionLogCompareFragment`.
     */
    queries: ActionLogDialogQueries<TGridData, TShowVersionData, TCompareVersionsData>;
    /**
     * Storage key for the persistent grid column state.
     */
    columnStateStorageKey?: string;
};

type ActionLogDialogApi = {
    openActionLogDialog: () => void;
    closeActionLogDialog: () => void;
};

export function useActionLogDialog<TGridData, TShowVersionData, TCompareVersionsData>({
    id,
    name,
    queries,
    columnStateStorageKey = "actionLogDialogGrid",
}: UseActionLogDialogOptions<TGridData, TShowVersionData, TCompareVersionsData>): [ComponentType, ActionLogDialogApi] {
    const [open, setOpen] = useState(false);
    const [view, setView] = useState<DialogView>({ type: "grid" });

    const dataGridRemote = useDataGridRemote({ initialSort: [{ field: "version", sort: "desc" }] });
    const persistentColumnState = usePersistentColumnState(columnStateStorageKey);

    const gridResult = useQuery<TGridData>(queries.grid.document, {
        skip: !open || view.type !== "grid",
        variables: {
            id,
            offset: dataGridRemote.paginationModel.page * dataGridRemote.paginationModel.pageSize,
            limit: dataGridRemote.paginationModel.pageSize,
            sort: muiGridSortToGql(dataGridRemote.sortModel) ?? [],
        },
    });

    const showVersionResult = useQuery<TShowVersionData>(queries.showVersion.document, {
        skip: !open || view.type !== "showVersion",
        variables: view.type === "showVersion" ? { id, versionId: view.versionId } : undefined,
    });

    const compareVersionsResult = useQuery<TCompareVersionsData>(queries.compareVersions.document, {
        skip: !open || view.type !== "compareVersions",
        variables: view.type === "compareVersions" ? { id, beforeId: view.beforeId, afterId: view.afterId } : undefined,
    });

    const value: ActionLogDialogValue = useMemo(() => {
        if (view.type === "showVersion") {
            return {
                type: "showVersion",
                actionLog: showVersionResult.data ? queries.showVersion.getActionLog(showVersionResult.data) : undefined,
                error: !!showVersionResult.error,
                loading: showVersionResult.loading,
            };
        }
        if (view.type === "compareVersions") {
            const versions = compareVersionsResult.data
                ? queries.compareVersions.getActionLogs(compareVersionsResult.data)
                : { beforeVersion: undefined, afterVersion: undefined };
            return {
                type: "compareVersions",
                beforeVersion: versions.beforeVersion,
                afterVersion: versions.afterVersion,
                error: !!compareVersionsResult.error,
                loading: compareVersionsResult.loading,
            };
        }
        return {
            ...dataGridRemote,
            ...persistentColumnState,
            type: "grid",
            actionLogs: gridResult.data ? queries.grid.getActionLogs(gridResult.data) : undefined,
            error: !!gridResult.error,
            loading: gridResult.loading,
        };
    }, [view, dataGridRemote, persistentColumnState, gridResult, showVersionResult, compareVersionsResult, queries]);

    const openActionLogDialog = useCallback(() => setOpen(true), []);
    const closeActionLogDialog = useCallback(() => {
        setOpen(false);
        setView({ type: "grid" });
    }, []);

    const api = useMemo<ActionLogDialogApi>(() => ({ openActionLogDialog, closeActionLogDialog }), [openActionLogDialog, closeActionLogDialog]);

    const latestPropsRef = useRef({ id, name, open, value, closeActionLogDialog });
    latestPropsRef.current = { id, name, open, value, closeActionLogDialog };

    const ActionLogDialog = useMemo<ComponentType>(
        () =>
            function ActionLogDialog() {
                const { id, name, open, value, closeActionLogDialog } = latestPropsRef.current;
                return (
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
                );
            },
        [],
    );

    return [ActionLogDialog, api];
}
