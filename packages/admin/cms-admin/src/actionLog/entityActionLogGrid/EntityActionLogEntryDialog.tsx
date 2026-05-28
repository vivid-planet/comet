import { useQuery } from "@apollo/client";
import { Dialog, InlineAlert, useDataGridRemote, usePersistentColumnState } from "@comet/admin";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { type ContentScope, useContentScope } from "../../contentScope/Provider";
import { ActionLogCompare } from "../actionLogCompare/ActionLogCompare";
import { ActionLogGrid } from "../actionLogGrid/ActionLogGrid";
import { ActionLogShowVersion } from "../actionLogShowVersion/ActionLogShowVersion";
import { buildEntityActionLogsQuery, type EntityActionLogQueryName } from "./EntityActionLogGrid";
import type { GQLEntityActionLogGridFragment } from "./EntityActionLogGrid.gql.generated";

type EntityActionLogEntryDialogView =
    | { type: "grid" }
    | { type: "showVersion"; row: GQLEntityActionLogGridFragment }
    | { type: "compareVersions"; before: GQLEntityActionLogGridFragment; after: GQLEntityActionLogGridFragment };

type EntityActionLogEntryDialogProps<TQuery> = {
    queryName: EntityActionLogQueryName<TQuery>;
    entityId: string;
    open: boolean;
    onClose: () => void;
};

type EntityActionLogsQueryResult = {
    [key: string]: { nodes: GQLEntityActionLogGridFragment[]; totalCount: number };
};

export function EntityActionLogEntryDialog<TQuery = Record<string, unknown>>({
    queryName,
    entityId,
    open,
    onClose,
}: EntityActionLogEntryDialogProps<TQuery>) {
    const intl = useIntl();
    const { scope } = useContentScope();
    const [view, setView] = useState<EntityActionLogEntryDialogView>({ type: "grid" });

    useEffect(() => {
        if (!open) {
            setView({ type: "grid" });
        }
    }, [open]);

    const actionLogsQuery = useMemo(() => buildEntityActionLogsQuery(queryName), [queryName]);
    const dataGridRemote = useDataGridRemote({ initialSort: [{ field: "version", sort: "desc" }] });
    const persistentColumnState = usePersistentColumnState(`EntityActionLogEntryDialog-${queryName}`);

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
                <ActionLogGrid
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
