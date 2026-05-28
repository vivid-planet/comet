import { Dialog } from "@comet/admin";
import { useIntl } from "react-intl";

import { ActionLogCompare } from "../actionLogCompare/ActionLogCompare";
import type { GQLActionLogCompareFragment } from "../actionLogCompare/ActionLogCompare.gql.generated";
import { ActionLogShowVersion } from "../actionLogShowVersion/ActionLogShowVersion";

type EntityActionLogShowVersionDialogProps = {
    actionLog: (GQLActionLogCompareFragment & { previousVersion?: GQLActionLogCompareFragment | null }) | null;
    open: boolean;
    onClose: () => void;
};

export function EntityActionLogShowVersionDialog({ actionLog, open, onClose }: EntityActionLogShowVersionDialogProps) {
    const intl = useIntl();
    const previous = actionLog?.previousVersion ?? undefined;
    const hasDiff = actionLog != null && previous != null;

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
            {actionLog && hasDiff && (
                <ActionLogCompare afterVersion={actionLog} beforeVersion={previous} error={false} loading={false} id={actionLog.id} />
            )}
            {actionLog && !hasDiff && <ActionLogShowVersion actionLog={actionLog} error={false} loading={false} id={actionLog.id} />}
        </Dialog>
    );
}
