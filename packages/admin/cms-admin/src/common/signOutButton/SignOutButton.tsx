import { useMutation } from "@apollo/client";
import { Logout, ThreeDotSaving } from "@comet/admin-icons";
import { Button, type ButtonProps as MuiButtonProps } from "@mui/material";
import { type FunctionComponent, type PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";

import { signOutMutation } from "./SignOutButton.gql";
import { type GQLSignOutMutation, type GQLSignOutMutationVariables } from "./SignOutButton.gql.generated";

type SignOutButtonProps = Omit<MuiButtonProps, "onClick">;

export const SignOutButton: FunctionComponent<PropsWithChildren<SignOutButtonProps>> = ({ children, ...restProps }) => {
    const [signOut, { loading: isSigningOut }] = useMutation<GQLSignOutMutation, GQLSignOutMutationVariables>(signOutMutation);

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
            {children ?? <FormattedMessage id="comet.signOutButton.title" defaultMessage="Logout" />}
        </Button>
    );
};
