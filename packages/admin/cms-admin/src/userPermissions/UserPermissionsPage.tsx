import { MainContent, Stack, StackPage, StackSwitch } from "@comet/admin";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { UserPage } from "./user/UserPage";
import { UserGrid } from "./UserGrid";

export const UserPermissionsPage = (): React.ReactElement => (
    <Stack topLevelTitle={<FormattedMessage id="comet.userPermissions.title" defaultMessage="User Management" />}>
        <StackSwitch>
            <StackPage name="table">
                <MainContent>
                    <DataGridContainer>
                        <UserGrid />
                    </DataGridContainer>
                </MainContent>
            </StackPage>
            <StackPage name="edit">{(userId) => <UserPage userId={userId} />}</StackPage>
        </StackSwitch>
    </Stack>
);

const DataGridContainer = styled("div")`
    width: 100%;
    height: calc(100vh - var(--comet-admin-master-layout-content-top-spacing) - 50px);
`;
