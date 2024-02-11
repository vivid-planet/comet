import { MainContent, Stack, StackPage, StackSwitch } from "@comet/admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { UserPage } from "./user/UserPage";
import { UserGrid } from "./UserGrid";

export interface UserPermissionsPageProps {
    configurationSlots?: { [key: string]: () => JSX.Element };
}

export const UserPermissionsSettings = React.createContext<UserPermissionsPageProps>({});

export const UserPermissionsPage = (props: UserPermissionsPageProps): React.ReactElement => (
    <UserPermissionsSettings.Provider value={props}>
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
    </UserPermissionsSettings.Provider>
);
