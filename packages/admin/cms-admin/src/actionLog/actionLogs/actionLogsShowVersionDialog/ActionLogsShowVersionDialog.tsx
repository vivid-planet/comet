import { useQuery } from "@apollo/client";
import { Dialog, InlineAlert } from "@comet/admin";
import { FormattedMessage, useIntl } from "react-intl";

import { ActionLogCompare } from "../../actionLogCompare/ActionLogCompare";
import { ActionLogShowVersion } from "../../actionLogShowVersion/ActionLogShowVersion";
import { actionLogsShowVersionQuery } from "./ActionLogsShowVersionDialog.gql";
import type { GQLActionLogsShowVersionQuery, GQLActionLogsShowVersionQueryVariables } from "./ActionLogsShowVersionDialog.gql.generated";

type ActionLogsShowVersionDialogProps = {
    actionLogId: string | null;
    open: boolean;
    onClose: () => void;
};

export function ActionLogsShowVersionDialog({ actionLogId, open, onClose }: ActionLogsShowVersionDialogProps) {
    const intl = useIntl();

    const { data, loading, error } = useQuery<GQLActionLogsShowVersionQuery, GQLActionLogsShowVersionQueryVariables>(actionLogsShowVersionQuery, {
        variables: { id: actionLogId ?? "" },
        skip: !open || actionLogId === null,
    });

    const current = data?.actionLog;
    const previous = current?.previousVersion ?? undefined;
    const hasDiff = current != null && previous != null;

    return (
        <Dialog
            fullWidth
            maxWidth={hasDiff ? "xl" : "md"}
            onClose={onClose}
            open={open}
            title={intl.formatMessage({
                id: "comet.actionLogs.versionDialog.title",
                defaultMessage: "Action Log",
            })}
        >
            {error && <InlineAlert title={<FormattedMessage id="comet.actionLogs.versionDialog.error" defaultMessage="Error loading version" />} />}
            {!error && actionLogId !== null && hasDiff && (
                <ActionLogCompare afterVersion={current} beforeVersion={previous} error={Boolean(error)} id={actionLogId} loading={loading} />
            )}
            {!error && actionLogId !== null && !hasDiff && (
                <ActionLogShowVersion actionLog={current ?? undefined} error={Boolean(error)} id={actionLogId} loading={loading} />
            )}
        </Dialog>
    );
}
