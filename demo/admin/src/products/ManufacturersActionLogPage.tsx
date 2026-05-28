import { EntityActionLogPage } from "@comet/cms-admin";
import { FormattedMessage } from "react-intl";

export function ManufacturersActionLogPage() {
    return (
        <EntityActionLogPage
            queryName="manufacturerActionLogs"
            title={<FormattedMessage id="menu.manufacturersActionLog" defaultMessage="Manufacturers Action Log" />}
        />
    );
}
