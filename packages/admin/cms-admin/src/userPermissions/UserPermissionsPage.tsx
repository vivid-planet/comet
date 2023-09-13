import { MainContent, Stack, StackPage, StackSwitch } from "@comet/admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { UserPage } from "./user/UserPage";
import { UserGrid } from "./UserGrid";

export const UserPermissionsPage = (): React.ReactElement => (
    <Stack topLevelTitle={<FormattedMessage id="comet.userPermissions.title" defaultMessage="User Management" />}>
        <StackSwitch>
            <StackPage name="table">
                <MainContent fullHeight>
                    <UserGrid />
                </MainContent>
            </StackPage>
            <StackPage name="edit">{(userId) => <UserPage userId={userId} />}</StackPage>
        </StackSwitch>
    </Stack>
);
