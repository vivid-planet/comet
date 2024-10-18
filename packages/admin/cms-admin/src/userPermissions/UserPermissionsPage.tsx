import { MainContent, Stack, StackPage, StackSwitch, Toolbar } from "@comet/admin";
import { FormattedMessage } from "react-intl";
import { useRouteMatch } from "react-router";

import { ContentScopeIndicator } from "../contentScope/ContentScopeIndicator";
import { useContentScope } from "../contentScope/Provider";
import { useContentScopeConfig } from "../contentScope/useContentScopeConfig";
import { UserPage } from "./user/UserPage";
import { UserGrid } from "./UserGrid";

export const UserPermissionsPage = () => {
    const { match } = useContentScope();
    const routeMatch = useRouteMatch();
    const location = routeMatch.url.replace(match.url, "");
    useContentScopeConfig({ redirectPathAfterChange: location });

    return (
        <Stack topLevelTitle={<FormattedMessage id="comet.userPermissions.title" defaultMessage="User Management" />}>
            <StackSwitch>
                <StackPage name="table">
                    <Toolbar scopeIndicator={<ContentScopeIndicator global />} />
                    <MainContent fullHeight>
                        <UserGrid />
                    </MainContent>
                </StackPage>
                <StackPage name="edit">{(userId) => <UserPage userId={userId} />}</StackPage>
            </StackSwitch>
        </Stack>
    );
};
