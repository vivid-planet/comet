import { EntityActionLogPage } from "@comet/cms-admin";
import { FormattedMessage } from "react-intl";

export function NewsActionLogPage() {
    return <EntityActionLogPage queryName="newsActionLogs" title={<FormattedMessage id="menu.newsActionLog" defaultMessage="News Action Log" />} />;
}
