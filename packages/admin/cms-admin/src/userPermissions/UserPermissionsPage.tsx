import { MainContent, RouterTab, RouterTabs, Stack, StackLink, StackPage, StackSwitch, StackToolbar } from "@comet/admin";
import { Edit } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useRouteMatch } from "react-router";

import { ContentScopeIndicator } from "../contentScope/ContentScopeIndicator";
import { useContentScope } from "../contentScope/Provider";
import { useContentScopeConfig } from "../contentScope/useContentScopeConfig";
import { UserPermissionsUserPageBasicDataPanel } from "./user/basicData/UserBasicData";
import { UserPermissionsUserPagePermissionsPanel } from "./user/permissions/PermissionsPanel";
import { UserPermissionsUserPageToolbar } from "./user/UserPageToolbar";
import { UserPermissionsUserGrid } from "./UserGrid";
import { LabelsContext, type LabelsContextType } from "./utils/LabelsContext";

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
            <Stack topLevelTitle={<FormattedMessage id="comet.userPermissions.title" defaultMessage="User Permissions" />}>
                <StackSwitch>
                    <StackPage name="table">
                        <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
                        <MainContent fullHeight>
                            <UserPermissionsUserGrid
                                rowAction={(params) => (
                                    <IconButton color="primary" component={StackLink} pageName="edit" payload={params.row.id} subUrl="permissions">
                                        <Edit />
                                    </IconButton>
                                )}
                            />
                        </MainContent>
                    </StackPage>
                    <StackPage name="edit" title={<FormattedMessage id="comet.userPermissions.edit" defaultMessage="User" />}>
                        {(userId) => (
                            <>
                                <UserPermissionsUserPageToolbar userId={userId} />
                                <MainContent>
                                    <RouterTabs>
                                        <RouterTab
                                            path=""
                                            label={<FormattedMessage id="comet.userPermissions.basicData" defaultMessage="Basic Data" />}
                                        >
                                            <UserPermissionsUserPageBasicDataPanel userId={userId} />
                                        </RouterTab>
                                        <RouterTab
                                            path="/permissions"
                                            label={<FormattedMessage id="comet.userPermissions.permissions" defaultMessage="Permissions" />}
                                        >
                                            <UserPermissionsUserPagePermissionsPanel userId={userId} />
                                        </RouterTab>
                                    </RouterTabs>
                                </MainContent>
                            </>
                        )}
                    </StackPage>
                </StackSwitch>
            </Stack>
        </LabelsContext.Provider>
    );
};
