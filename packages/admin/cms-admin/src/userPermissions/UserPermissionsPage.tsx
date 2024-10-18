import { MainContent, Stack, StackPage, StackSwitch, Toolbar } from "@comet/admin";
import { FormattedMessage } from "react-intl";
import { useRouteMatch } from "react-router";

import { ContentScopeIndicator } from "../contentScope/ContentScopeIndicator";
import { useContentScope } from "../contentScope/Provider";
import { useContentScopeConfig } from "../contentScope/useContentScopeConfig";
import { UserPage } from "./user/UserPage";
import { UserGrid } from "./UserGrid";
import { LabelsContext, LabelsContextType } from "./utils/LabelsContext";

type UserPermissionsPageProps = LabelsContextType;

export const UserPermissionsPage = ({ permissionLabels }: UserPermissionsPageProps) => {
    const { match } = useContentScope();
    const routeMatch = useRouteMatch();
    const location = routeMatch.url.replace(match.url, "");
    useContentScopeConfig({ redirectPathAfterChange: location });

    return (
        <LabelsContext.Provider
            value={{
                permissionLabels: {
                    pageTree: <FormattedMessage id="comet.userPermissions.permissions.pageTree" defaultMessage="Page tree" />,
                    builds: <FormattedMessage id="comet.userPermissions.permissions.builds" defaultMessage="Builds" />,
                    cronJobs: <FormattedMessage id="comet.userPermissions.permissions.cronJobs" defaultMessage="Cron jobs" />,
                    dam: <FormattedMessage id="comet.userPermissions.permissions.dam" defaultMessage="Assets" />,
                    dependencies: <FormattedMessage id="comet.userPermissions.permissions.dependencies" defaultMessage="Dependencies" />,
                    userPermissions: <FormattedMessage id="comet.userPermissions.permissions.userPermissions" defaultMessage="User permissions" />,
                    ...permissionLabels,
                },
            }}
        >
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
        </LabelsContext.Provider>
    );
};
