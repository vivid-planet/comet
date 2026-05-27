import { useQuery } from "@apollo/client";
import { Dialog, InlineAlert, useDataGridRemote, usePersistentColumnState } from "@comet/admin";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ActionLogCompare } from "../actionLogCompare/ActionLogCompare";
import { ActionLogGrid } from "../actionLogGrid/ActionLogGrid";
import { ActionLogShowVersion } from "../actionLogShowVersion/ActionLogShowVersion";
import {
    type ActionLogDialogCompareQueryResult,
    type ActionLogDialogCompareQueryVariables,
    type ActionLogDialogGridQueryResult,
    type ActionLogDialogGridQueryVariables,
    type ActionLogDialogShowVersionQueryResult,
    type ActionLogDialogShowVersionQueryVariables,
    createActionLogDialogCompareQuery,
    createActionLogDialogGridQuery,
    createActionLogDialogShowVersionQuery,
} from "./ActionLogDialog.gql";

type ActionLogDialogView =
    | { type: "grid" }
    | { type: "showVersion"; versionId: string }
    | { type: "compareVersions"; beforeVersionId: string; afterVersionId: string };

/**
 * Keys of `TQuery` whose value structurally exposes both `actionLog` and `actionLogs`
 * (i.e. entities decorated with `@ActionLogs()`). Falls back to `string` when no generic is supplied.
 */
type ActionLogRootField<TQuery> = string extends keyof TQuery
    ? string
    : {
          [K in keyof TQuery]: NonNullable<TQuery[K]> extends { actionLog: unknown; actionLogs: unknown } ? K : never;
      }[keyof TQuery] &
          string;

type ActionLogDialogProps<TQuery> = {
    id: string;
    /**
     * GraphQL root field exposing the entity (e.g. "manufacturer", "product").
     * The entity must expose `actionLog(id)` and `actionLogs(offset, limit, sort)` via `@ActionLogs()`.
     *
     * Pass your app's `GQLQuery` as the generic to constrain this to entities decorated with `@ActionLogs()`.
     */
    rootField: ActionLogRootField<TQuery>;
    /**
     * Latest name of the entity, displayed in titles.
     */
    name?: string;
    open: boolean;
    onClose: () => void;
};

export function ActionLogDialog<TQuery = Record<string, unknown>>({ id, rootField, name, open, onClose }: ActionLogDialogProps<TQuery>) {
    const intl = useIntl();
    const [view, setView] = useState<ActionLogDialogView>({ type: "grid" });

    useEffect(() => {
        if (!open) {
            setView({ type: "grid" });
        }
    }, [open]);

    const dataGridRemote = useDataGridRemote({ initialSort: [{ field: "version", sort: "desc" }] });
    const persistentColumnState = usePersistentColumnState(`ActionLogDialog-${rootField}`);

    const gridQuery = useMemo(() => createActionLogDialogGridQuery(rootField), [rootField]);
    const showVersionQuery = useMemo(() => createActionLogDialogShowVersionQuery(rootField), [rootField]);
    const compareQuery = useMemo(() => createActionLogDialogCompareQuery(rootField), [rootField]);

    const gridResult = useQuery<ActionLogDialogGridQueryResult, ActionLogDialogGridQueryVariables>(gridQuery, {
        variables: {
            id,
            offset: dataGridRemote.paginationModel.page * dataGridRemote.paginationModel.pageSize,
            limit: dataGridRemote.paginationModel.pageSize,
            sort: dataGridRemote.sortModel.map((entry) => ({
                field: entry.field,
                direction: entry.sort === "desc" ? "DESC" : "ASC",
            })),
        },
        skip: !open || view.type !== "grid",
    });

    const showVersionResult = useQuery<ActionLogDialogShowVersionQueryResult, ActionLogDialogShowVersionQueryVariables>(showVersionQuery, {
        variables: { id, versionId: view.type === "showVersion" ? view.versionId : "" },
        skip: !open || view.type !== "showVersion",
    });

    const compareResult = useQuery<ActionLogDialogCompareQueryResult, ActionLogDialogCompareQueryVariables>(compareQuery, {
        variables:
            view.type === "compareVersions"
                ? { id, beforeVersionId: view.beforeVersionId, afterVersionId: view.afterVersionId }
                : { id, beforeVersionId: "", afterVersionId: "" },
        skip: !open || view.type !== "compareVersions",
    });

    return (
        <Dialog
            fullWidth
            maxWidth={view.type === "compareVersions" ? "xl" : "md"}
            onClose={onClose}
            open={open}
            title={intl.formatMessage({
                defaultMessage: "Action Log",
                id: "actionLog.actionLogModal.title",
            })}
        >
            {view.type === "grid" && gridResult.error && (
                <InlineAlert title={<FormattedMessage defaultMessage="Error loading action logs" id="actionLog.actionLogDialog.gridError.title" />} />
            )}

            {view.type === "grid" && !gridResult.error && (
                <ActionLogGrid
                    {...dataGridRemote}
                    {...persistentColumnState}
                    actionLogs={gridResult.data?.entity?.actionLogs ?? undefined}
                    id={id}
                    loading={gridResult.loading}
                    name={name}
                    onShowVersionClick={(versionId) => setView({ type: "showVersion", versionId })}
                    onCompareVersionsClick={(beforeVersionId, afterVersionId) =>
                        setView({ type: "compareVersions", beforeVersionId, afterVersionId })
                    }
                />
            )}

            {view.type === "showVersion" && (
                <ActionLogShowVersion
                    actionLog={showVersionResult.data?.entity?.actionLog ?? undefined}
                    error={Boolean(showVersionResult.error)}
                    id={id}
                    loading={showVersionResult.loading}
                    name={name}
                    onClickShowVersionHistory={() => setView({ type: "grid" })}
                />
            )}

            {view.type === "compareVersions" && (
                <ActionLogCompare
                    afterVersion={compareResult.data?.entity?.afterVersion ?? undefined}
                    beforeVersion={compareResult.data?.entity?.beforeVersion ?? undefined}
                    error={Boolean(compareResult.error)}
                    id={id}
                    loading={compareResult.loading}
                    name={name}
                    onClickShowVersionHistory={() => setView({ type: "grid" })}
                />
            )}
        </Dialog>
    );
}
