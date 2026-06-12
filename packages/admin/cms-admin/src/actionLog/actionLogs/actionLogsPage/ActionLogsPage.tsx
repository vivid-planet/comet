import { Stack, StackToolbar } from "@comet/admin";
import { useIntl } from "react-intl";

import { ContentScopeIndicator } from "../../../contentScope/ContentScopeIndicator";
import { ActionLogsGrid } from "../actionLogsGrid/ActionLogsGrid";

export function ActionLogsPage() {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "comet.actionLogs.title", defaultMessage: "Action Log" })}>
            <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
            <ActionLogsGrid />
        </Stack>
    );
}
