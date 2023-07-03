import { MainContent, Stack, StackPage, StackSwitch } from "@comet/admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { FullHeightBox } from "./Comet";
import { UserPage } from "./user/UserPage";
import { UserGrid } from "./UserGrid";

export interface UserManagementPageProps {
    configurationSlots?: { [key: string]: () => JSX.Element };
}

export const UserManagementSettings = React.createContext<UserManagementPageProps>({});

export const UserManagementPage = (props: UserManagementPageProps): React.ReactElement => (
    <UserManagementSettings.Provider value={props}>
        <Stack topLevelTitle={<FormattedMessage id="comet.userManagement.title" defaultMessage="User Management" />}>
            <StackSwitch>
                <StackPage name="table">
                    <MainContent>
                        <FullHeightBox bottomSpacing={50}>
                            <UserGrid />
                        </FullHeightBox>
                    </MainContent>
                </StackPage>
                <StackPage name="edit">{(userId) => <UserPage userId={userId} />}</StackPage>
            </StackSwitch>
        </Stack>
    </UserManagementSettings.Provider>
);
