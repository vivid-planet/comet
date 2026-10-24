import { MainNavigation, MainNavigationItemRouterLink } from "@dextinity/admin";
import { Assets } from "@dextinity/admin-icons";
import { useCan } from "@dextinity/serverless-permissions/client";
import { FormattedMessage } from "react-intl";

export function MasterMenu() {
    const canUseDam = useCan("dam");

    return (
        <MainNavigation>
            {canUseDam && (
                <MainNavigationItemRouterLink
                    primary={<FormattedMessage id="menu.assets" defaultMessage="Assets" />}
                    icon={<Assets />}
                    to="/assets"
                />
            )}
        </MainNavigation>
    );
}
