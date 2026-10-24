import { MainNavigation, MainNavigationItemRouterLink } from "@dextinity/admin";
import { Assets } from "@dextinity/admin-icons";
import { FormattedMessage } from "react-intl";

export function MasterMenu() {
    return (
        <MainNavigation>
            <MainNavigationItemRouterLink primary={<FormattedMessage id="menu.assets" defaultMessage="Assets" />} icon={<Assets />} to="/assets" />
        </MainNavigation>
    );
}
