import { gql, useMutation } from "@apollo/client";
import { AppHeaderDropdown } from "@comet/admin";
import { Account, Logout } from "@comet/admin-icons";
import { CircularProgress } from "@mui/material";
import React from "react";
import { FormattedMessage } from "react-intl";

import { useUser } from "../../user/useUser";
import { HeaderAboutButton } from "./about/AboutButton";
import { HeaderButton, HeaderDropdownContent, HeaderSeparator } from "./Header.sc";

const signOutMutation = gql`
    mutation SignOut {
        signOut
    }
`;

export function HeaderAboutItem(): React.ReactElement {
    const user = useUser();
    const [signOut, { loading: isSigningOut }] = useMutation(signOutMutation);

    if (user === undefined) {
        return <CircularProgress />;
    }
    return (
        <AppHeaderDropdown buttonChildren={user?.name} startIcon={<Account />}>
            <HeaderDropdownContent padding={4}>
                <HeaderAboutButton />
                <HeaderSeparator />
                {isSigningOut && <CircularProgress />}
                {!isSigningOut && (
                    <HeaderButton
                        fullWidth
                        variant="contained"
                        color="primary"
                        endIcon={<Logout />}
                        onClick={async () => {
                            const result = await signOut();
                            location.href = result.data.signOut;
                        }}
                    >
                        <FormattedMessage id="comet.logout" defaultMessage="Logout" />
                    </HeaderButton>
                )}
            </HeaderDropdownContent>
        </AppHeaderDropdown>
    );
}
