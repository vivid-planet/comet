import { useQuery } from "@apollo/client";
import { Dialog } from "@comet/admin";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { type ContentScope, useContentScope } from "../../../contentScope/Provider";
import { ActionLogCompare } from "../../components/actionLogCompare/ActionLogCompare";
import { ActionLogShowVersion } from "../../components/actionLogShowVersion/ActionLogShowVersion";
import { type ActionLogQueryName, buildEntityActionLogsQuery } from "../actionLogGrid/ActionLogGrid";
import type { GQLActionLogGridFragment } from "../actionLogGrid/ActionLogGrid.gql.generated";

type ActionLogShowVersionDialogProps<TQuery> = {
    queryName: ActionLogQueryName<TQuery>;
    row: GQLActionLogGridFragment | null;
    open: boolean;
    onClose: () => void;
};

type EntityActionLogsQueryResult = {
    [key: string]: { nodes: GQLActionLogGridFragment[]; totalCount: number };
};

export function ActionLogShowVersionDialog<TQuery = Record<string, unknown>>({
    queryName,
    row,
    open,
    onClose,
}: ActionLogShowVersionDialogProps<TQuery>) {
    const intl = useIntl();
    const { scope } = useContentScope();
    const actionLogsQuery = useMemo(() => buildEntityActionLogsQuery(queryName), [queryName]);

    const { data, loading } = useQuery<EntityActionLogsQueryResult>(actionLogsQuery, {
        variables: {
            scope: scope as ContentScope,
            offset: 0,
            limit: 1,
            filter: {
                entityId: { equal: row?.entityId },
                version: { lowerThan: row?.version },
            },
            sort: [{ field: "version", direction: "DESC" }],
        },
        skip: !open || row === null || row.version <= 1,
    });

    const previous = data?.[queryName]?.nodes[0] ?? undefined;
    const hasDiff = row != null && previous != null;

    return (
        <Dialog
            fullWidth
            maxWidth={hasDiff ? "xl" : "md"}
            onClose={onClose}
            open={open}
            title={intl.formatMessage({
                id: "comet.actionLog.entity.versionDialog.title",
                defaultMessage: "Action Log",
            })}
        >
            {row && hasDiff && <ActionLogCompare afterVersion={row} beforeVersion={previous} error={false} loading={loading} id={row.id} />}
            {row && !hasDiff && <ActionLogShowVersion actionLog={row} error={false} loading={loading} id={row.id} />}
        </Dialog>
    );
}
