import { gql, useMutation } from "@apollo/client";
import { AppHeaderDropdown, Loading } from "@comet/admin";
import { Account, Info, Logout } from "@comet/admin-icons";
import { Box, Button as MUIButton, useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

import { useCurrentUser } from "../../userPermissions/hooks/currentUser";
import { AboutModal } from "./about/AboutModal";
import { GQLSignOutMutation } from "./UserHeaderItem.generated";

const DropdownContent = styled(Box)`
    width: 250px;
`;

const Button = styled(MUIButton)`
    justify-content: flex-start;
`;

const Separator = styled(Box)`
    background-color: ${(props) => props.theme.palette.grey["100"]};
    height: 1px;
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
`;

const signOutMutation = gql`
    mutation SignOut {
        currentUserSignOut
    }
`;

interface UserHeaderItemProps {
    aboutModalLogo?: React.ReactElement;
}

export function UserHeaderItem(props: UserHeaderItemProps): React.ReactElement {
    const { aboutModalLogo } = props;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.up("sm"));

    const user = useCurrentUser();
    const [showAboutModal, setShowAboutModal] = React.useState(false);
    const [signOut, { loading: isSigningOut }] = useMutation<GQLSignOutMutation>(signOutMutation);

    return (
        <AppHeaderDropdown buttonChildren={isMobile ? undefined : user.name} startIcon={<Account />}>
            <DropdownContent padding={4}>
                <Button
                    fullWidth={true}
                    startIcon={<Info />}
                    onClick={() => {
                        setShowAboutModal(true);
                    }}
                    color="info"
                >
                    <FormattedMessage id="comet.about" defaultMessage="About" />
                </Button>
                <Separator />
                {isSigningOut ? (
                    <Loading />
                ) : (
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        endIcon={<Logout />}
                        onClick={async () => {
                            const result = await signOut();
                            if (result.data) {
                                location.href = result.data.currentUserSignOut;
                            }
                        }}
                    >
                        <FormattedMessage id="comet.logout" defaultMessage="Logout" />
                    </Button>
                )}
            </DropdownContent>
            <AboutModal
                open={showAboutModal}
                onClose={() => {
                    setShowAboutModal(false);
                }}
                logo={aboutModalLogo}
            />
        </AppHeaderDropdown>
    );
}
