import { EntityActionLogPage } from "@comet/cms-admin";
import { FormattedMessage } from "react-intl";

export function ProductsActionLogPage() {
    return (
        <EntityActionLogPage
            queryName="productActionLogs"
            title={<FormattedMessage id="menu.productsActionLog" defaultMessage="Products Action Log" />}
        />
    );
}
