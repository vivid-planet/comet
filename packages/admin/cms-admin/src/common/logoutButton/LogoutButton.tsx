import { useMutation } from "@apollo/client";
import { Logout, ThreeDotSaving } from "@comet/admin-icons";
import { Button, type ButtonProps as MuiButtonProps } from "@mui/material";
import { type FunctionComponent, type PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";

import { signOutMutation } from "./LogoutButton.gql";
import { type GQLSignOutMutation } from "./LogoutButton.gql.generated";

type ButtonProps = Omit<MuiButtonProps, "onClick">;

export const LogoutButton: FunctionComponent<PropsWithChildren<ButtonProps>> = ({ children, ...restProps }) => {
    const [signOut, { loading: isSigningOut }] = useMutation<GQLSignOutMutation>(signOutMutation);

    return (
        <Button
            {...restProps}
            disabled={isSigningOut}
            startIcon={isSigningOut ? <ThreeDotSaving /> : <Logout />}
            onClick={async () => {
                const result = await signOut();
                if (result.data) {
                    location.href = result.data.currentUserSignOut;
                }
            }}
        >
            {children ?? <FormattedMessage id="comet.logoutButton.title" defaultMessage="Logout" />}
        </Button>
    );
};
