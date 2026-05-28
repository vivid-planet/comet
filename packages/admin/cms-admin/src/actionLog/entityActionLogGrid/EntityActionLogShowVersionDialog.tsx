import { useQuery } from "@apollo/client";
import { Dialog } from "@comet/admin";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { type ContentScope, useContentScope } from "../../contentScope/Provider";
import { ActionLogCompare } from "../actionLogCompare/ActionLogCompare";
import { ActionLogShowVersion } from "../actionLogShowVersion/ActionLogShowVersion";
import { buildEntityActionLogsQuery, type EntityActionLogQueryName } from "./EntityActionLogGrid";
import type { GQLEntityActionLogGridFragment } from "./EntityActionLogGrid.gql.generated";

type EntityActionLogShowVersionDialogProps<TQuery> = {
    queryName: EntityActionLogQueryName<TQuery>;
    row: GQLEntityActionLogGridFragment | null;
    open: boolean;
    onClose: () => void;
};

type EntityActionLogsQueryResult = {
    [key: string]: { nodes: GQLEntityActionLogGridFragment[]; totalCount: number };
};

export function EntityActionLogShowVersionDialog<TQuery = Record<string, unknown>>({
    queryName,
    row,
    open,
    onClose,
}: EntityActionLogShowVersionDialogProps<TQuery>) {
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
