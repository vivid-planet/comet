import { useQuery } from "@apollo/client";
import { muiGridSortToGql, useDataGridRemote, usePersistentColumnState } from "@comet/admin";
import { type ComponentType, useCallback, useMemo, useRef, useState } from "react";

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

type ExtractActionLogRootFields<TQuery> = {
    [K in keyof TQuery]: NonNullable<TQuery[K]> extends { actionLog: unknown; actionLogs: unknown } ? K & string : never;
}[keyof TQuery];

/**
 * Names of GraphQL root fields that expose `actionLog`/`actionLogs`, derived from the consuming app's `GQLQuery` type.
 * Falls back to `string` when no `TQuery` is provided (e.g. when using the hook without an explicit generic).
 */
type ActionLogRootField<TQuery> = [ExtractActionLogRootFields<TQuery>] extends [never] ? string : ExtractActionLogRootFields<TQuery>;

type UseActionLogDialogOptions<TQuery> = {
    /**
     * GraphQL root field name of the entity that exposes `actionLog`/`actionLogs`, e.g. `"manufacturer"`, `"product"`, `"news"`.
     * Pass your app's `GQLQuery` as the hook's generic argument to constrain this to valid fields.
     */
    rootField: ActionLogRootField<TQuery>;
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

export function useActionLogDialog<TQuery = unknown>({
    rootField,
    id,
    name,
    columnStateStorageKey,
}: UseActionLogDialogOptions<TQuery>): [ComponentType, ActionLogDialogApi] {
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
