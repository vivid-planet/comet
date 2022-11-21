import { AppHeaderDropdown } from "@comet/admin";
import { Account, Logout } from "@comet/admin-icons";
import { useAuthorization, useUser } from "@comet/react-app-auth";
import React from "react";
import { FormattedMessage } from "react-intl";

import { HeaderAboutButton } from "./about/AboutButton";
import { HeaderButton, HeaderDropdownContent, HeaderSeparator } from "./Header.sc";

export function UserHeaderItem(): React.ReactElement {
    const authorization = useAuthorization();
    const user = useUser();

    return (
        <AppHeaderDropdown buttonChildren={user?.name} startIcon={<Account />}>
            <HeaderDropdownContent padding={4}>
                <HeaderAboutButton />
                <HeaderSeparator />
                <HeaderButton
                    fullWidth
                    variant="contained"
                    color="primary"
                    endIcon={<Logout />}
                    onClick={async () => {
                        if (authorization) {
                            await authorization?.authorizationManager.signOut();
                        } else {
                            // eslint-disable-next-line no-console
                            console.error("Can not log out -> can not find authorizationManager");
                        }
                    }}
                >
                    <FormattedMessage id="comet.logout" defaultMessage="Logout" />
                </HeaderButton>
            </HeaderDropdownContent>
        </AppHeaderDropdown>
    );
}
