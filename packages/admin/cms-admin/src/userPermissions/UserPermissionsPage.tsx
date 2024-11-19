import { MainContent, RouterTab, RouterTabs, Stack, StackLink, StackPage, StackSwitch, StackToolbar } from "@comet/admin";
import { Edit } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { ContentScopeIndicator } from "../contentScope/ContentScopeIndicator";
<<<<<<< HEAD
import { UserPage } from "./user/UserPage";
import { UserGrid } from "./UserGrid";
=======
import { useContentScope } from "../contentScope/Provider";
import { useContentScopeConfig } from "../contentScope/useContentScopeConfig";
import { UserPermissionsUserPageBasicDataPanel } from "./user/basicData/UserBasicData";
import { UserPermissionsUserPagePermissionsPanel } from "./user/permissions/PermissionsPanel";
import { UserPermissionsUserPageToolbar } from "./user/UserPageToolbar";
import { UserPermissionsUserGrid } from "./UserGrid";
>>>>>>> main

export const UserPermissionsPage = () => {
    return (
        <Stack topLevelTitle={<FormattedMessage id="comet.userPermissions.title" defaultMessage="User Permissions" />}>
            <StackSwitch>
                <StackPage name="table">
                    <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
                    <MainContent fullHeight>
                        <UserPermissionsUserGrid
                            rowAction={(params) => (
                                <IconButton component={StackLink} pageName="edit" payload={params.row.id} subUrl="permissions">
                                    <Edit color="primary" />
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
                                    <RouterTab path="" label={<FormattedMessage id="comet.userPermissions.basicData" defaultMessage="Basic Data" />}>
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
    );
};
