import { useQuery } from "@apollo/client";
import { Dialog, InlineAlert, useDataGridRemote, usePersistentColumnState } from "@comet/admin";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { type ContentScope, useContentScope } from "../../../contentScope/Provider";
import { ActionLogCompare } from "../../components/actionLogCompare/ActionLogCompare";
import { ActionLogShowVersion } from "../../components/actionLogShowVersion/ActionLogShowVersion";
import { type ActionLogQueryName, buildEntityActionLogsQuery } from "../actionLogGrid/ActionLogGrid";
import type { GQLActionLogGridFragment } from "../actionLogGrid/ActionLogGrid.gql.generated";
import { ActionLogVersionGrid } from "../actionLogVersionGrid/ActionLogVersionGrid";

type ActionLogEntryDialogView =
    | { type: "grid" }
    | { type: "showVersion"; row: GQLActionLogGridFragment }
    | { type: "compareVersions"; before: GQLActionLogGridFragment; after: GQLActionLogGridFragment };

type ActionLogEntryDialogProps<TQuery> = {
    queryName: ActionLogQueryName<TQuery>;
    entityId: string;
    open: boolean;
    onClose: () => void;
};

type EntityActionLogsQueryResult = {
    [key: string]: { nodes: GQLActionLogGridFragment[]; totalCount: number };
};

export function ActionLogEntryDialog<TQuery = Record<string, unknown>>({ queryName, entityId, open, onClose }: ActionLogEntryDialogProps<TQuery>) {
    const intl = useIntl();
    const { scope } = useContentScope();
    const [view, setView] = useState<ActionLogEntryDialogView>({ type: "grid" });

    useEffect(() => {
        if (!open) {
            setView({ type: "grid" });
        }
    }, [open]);

    const actionLogsQuery = useMemo(() => buildEntityActionLogsQuery(queryName), [queryName]);
    const dataGridRemote = useDataGridRemote({ initialSort: [{ field: "version", sort: "desc" }] });
    const persistentColumnState = usePersistentColumnState(`ActionLogEntryDialog-${queryName}`);

    const filter = useMemo(() => ({ entityId: { equal: entityId } }), [entityId]);

    const { data, loading, error } = useQuery<EntityActionLogsQueryResult>(actionLogsQuery, {
        variables: {
            scope: scope as ContentScope,
            offset: dataGridRemote.paginationModel.page * dataGridRemote.paginationModel.pageSize,
            limit: dataGridRemote.paginationModel.pageSize,
            filter,
            sort: dataGridRemote.sortModel.map((entry) => ({
                field: entry.field,
                direction: entry.sort === "desc" ? "DESC" : "ASC",
            })),
        },
        skip: !open,
    });

    const result = data?.[queryName];
    const rows = result?.nodes ?? [];

    return (
        <Dialog
            fullWidth
            maxWidth={view.type === "compareVersions" ? "xl" : "md"}
            onClose={onClose}
            open={open}
            title={intl.formatMessage({
                id: "comet.actionLog.entity.entryDialog.title",
                defaultMessage: "Action Log",
            })}
        >
            {view.type === "grid" && error && (
                <InlineAlert
                    title={<FormattedMessage id="comet.actionLog.entity.entryDialog.gridError" defaultMessage="Error loading action logs" />}
                />
            )}

            {view.type === "grid" && !error && (
                <ActionLogVersionGrid
                    {...dataGridRemote}
                    {...persistentColumnState}
                    actionLogs={result}
                    id={entityId}
                    loading={loading}
                    onShowVersionClick={(versionId) => {
                        const row = rows.find((r) => r.id === versionId);
                        if (row) {
                            setView({ type: "showVersion", row });
                        }
                    }}
                    onCompareVersionsClick={(beforeVersionId, afterVersionId) => {
                        const before = rows.find((r) => r.id === beforeVersionId);
                        const after = rows.find((r) => r.id === afterVersionId);
                        if (before && after) {
                            setView({ type: "compareVersions", before, after });
                        }
                    }}
                />
            )}

            {view.type === "showVersion" && (
                <ActionLogShowVersion
                    actionLog={view.row}
                    error={false}
                    loading={false}
                    id={entityId}
                    onClickShowVersionHistory={() => setView({ type: "grid" })}
                />
            )}

            {view.type === "compareVersions" && (
                <ActionLogCompare
                    afterVersion={view.after}
                    beforeVersion={view.before}
                    error={false}
                    loading={false}
                    id={entityId}
                    onClickShowVersionHistory={() => setView({ type: "grid" })}
                />
            )}
        </Dialog>
    );
}
