import { useQuery } from "@apollo/client";
import { Dialog, InlineAlert, useDataGridRemote, usePersistentColumnState } from "@comet/admin";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useContentScope } from "../../../contentScope/Provider";
import type { GQLActionLogSortField } from "../../../graphql.generated";
import { ActionLogVersionGrid } from "../../actionLog/actionLogVersionGrid/ActionLogVersionGrid";
import { ActionLogCompare } from "../../components/actionLogCompare/ActionLogCompare";
import { ActionLogShowVersion } from "../../components/actionLogShowVersion/ActionLogShowVersion";
import {
    globalActionLogDialogCompareQuery,
    globalActionLogDialogGridQuery,
    globalActionLogDialogShowVersionQuery,
} from "./GlobalActionLogDialog.gql";
import type {
    GQLGlobalActionLogDialogCompareQuery,
    GQLGlobalActionLogDialogCompareQueryVariables,
    GQLGlobalActionLogDialogGridQuery,
    GQLGlobalActionLogDialogGridQueryVariables,
    GQLGlobalActionLogDialogShowVersionQuery,
    GQLGlobalActionLogDialogShowVersionQueryVariables,
} from "./GlobalActionLogDialog.gql.generated";

type GlobalActionLogDialogView =
    | { type: "grid" }
    | { type: "showVersion"; versionId: string }
    | { type: "compareVersions"; beforeVersionId: string; afterVersionId: string };

type GlobalActionLogDialogProps = {
    entityName: string;
    entityId: string;
    open: boolean;
    onClose: () => void;
};

export function GlobalActionLogDialog({ entityName, entityId, open, onClose }: GlobalActionLogDialogProps) {
    const intl = useIntl();
    const { values: scopeValues } = useContentScope();
    const scopes = useMemo(() => scopeValues.map((item) => item.scope), [scopeValues]);
    const [view, setView] = useState<GlobalActionLogDialogView>({ type: "grid" });

    useEffect(() => {
        if (!open) {
            setView({ type: "grid" });
        }
    }, [open]);

    const dataGridRemote = useDataGridRemote({ initialSort: [{ field: "version", sort: "desc" }] });
    const persistentColumnState = usePersistentColumnState(`GlobalActionLogDialog-${entityName}`);

    const filter = useMemo(
        () => ({
            entityName: { equal: entityName },
            entityId: { equal: entityId },
        }),
        [entityName, entityId],
    );

    const gridResult = useQuery<GQLGlobalActionLogDialogGridQuery, GQLGlobalActionLogDialogGridQueryVariables>(globalActionLogDialogGridQuery, {
        variables: {
            filter,
            scopes,
            offset: dataGridRemote.paginationModel.page * dataGridRemote.paginationModel.pageSize,
            limit: dataGridRemote.paginationModel.pageSize,
            sort: dataGridRemote.sortModel.map((entry) => ({
                field: entry.field as GQLActionLogSortField,
                direction: entry.sort === "desc" ? "DESC" : "ASC",
            })),
        },
        skip: !open || view.type !== "grid",
    });

    const showVersionResult = useQuery<GQLGlobalActionLogDialogShowVersionQuery, GQLGlobalActionLogDialogShowVersionQueryVariables>(
        globalActionLogDialogShowVersionQuery,
        {
            variables: { id: view.type === "showVersion" ? view.versionId : "" },
            skip: !open || view.type !== "showVersion",
        },
    );

    const compareResult = useQuery<GQLGlobalActionLogDialogCompareQuery, GQLGlobalActionLogDialogCompareQueryVariables>(
        globalActionLogDialogCompareQuery,
        {
            variables:
                view.type === "compareVersions" ? { beforeId: view.beforeVersionId, afterId: view.afterVersionId } : { beforeId: "", afterId: "" },
            skip: !open || view.type !== "compareVersions",
        },
    );

    const showVersionCurrent = showVersionResult.data?.actionLog;
    const showVersionPrevious = showVersionCurrent?.previousVersion ?? undefined;
    const showVersionHasDiff = showVersionCurrent != null && showVersionPrevious != null;

    return (
        <Dialog
            fullWidth
            maxWidth={view.type === "compareVersions" || showVersionHasDiff ? "xl" : "md"}
            onClose={onClose}
            open={open}
            title={intl.formatMessage({
                id: "comet.globalActionLogDialog.title",
                defaultMessage: "Action Log",
            })}
        >
            {view.type === "grid" && gridResult.error && (
                <InlineAlert title={<FormattedMessage id="comet.globalActionLogDialog.gridError" defaultMessage="Error loading action logs" />} />
            )}

            {view.type === "grid" && !gridResult.error && (
                <ActionLogVersionGrid
                    {...dataGridRemote}
                    {...persistentColumnState}
                    actionLogs={gridResult.data?.actionLogs ?? undefined}
                    id={entityId}
                    loading={gridResult.loading}
                    onShowVersionClick={(versionId) => setView({ type: "showVersion", versionId })}
                    onCompareVersionsClick={(beforeVersionId, afterVersionId) =>
                        setView({ type: "compareVersions", beforeVersionId, afterVersionId })
                    }
                />
            )}

            {view.type === "showVersion" && showVersionHasDiff && (
                <ActionLogCompare
                    afterVersion={showVersionCurrent}
                    beforeVersion={showVersionPrevious}
                    error={Boolean(showVersionResult.error)}
                    id={entityId}
                    loading={showVersionResult.loading}
                    onClickShowVersionHistory={() => setView({ type: "grid" })}
                />
            )}

            {view.type === "showVersion" && !showVersionHasDiff && (
                <ActionLogShowVersion
                    actionLog={showVersionCurrent ?? undefined}
                    error={Boolean(showVersionResult.error)}
                    id={entityId}
                    loading={showVersionResult.loading}
                    onClickShowVersionHistory={() => setView({ type: "grid" })}
                />
            )}

            {view.type === "compareVersions" && (
                <ActionLogCompare
                    afterVersion={compareResult.data?.afterVersion ?? undefined}
                    beforeVersion={compareResult.data?.beforeVersion ?? undefined}
                    error={Boolean(compareResult.error)}
                    id={entityId}
                    loading={compareResult.loading}
                    onClickShowVersionHistory={() => setView({ type: "grid" })}
                />
            )}
        </Dialog>
    );
}
