import { gql, useMutation } from "@apollo/client";
import { AppHeaderDropdown, AppHeaderDropdownProps, Loading } from "@comet/admin";
import { Account, Clear, Info, Logout } from "@comet/admin-icons";
import { Box, Button as MUIButton, useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { PropsWithChildren, ReactElement, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useCurrentUser } from "../../userPermissions/hooks/currentUser";
import { StopImpersonationButton } from "../../userPermissions/user/UserPage";
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
    aboutModalLogo?: ReactElement;
    buttonChildren?: AppHeaderDropdownProps["buttonChildren"];
}

export function UserHeaderItem(props: PropsWithChildren<UserHeaderItemProps>) {
    const { aboutModalLogo, buttonChildren, children } = props;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const user = useCurrentUser();
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [signOut, { loading: isSigningOut }] = useMutation<GQLSignOutMutation>(signOutMutation);

    const AccountIcon = user.impersonated ? <Account color="info" /> : <Account />;

    return (
        <AppHeaderDropdown buttonChildren={buttonChildren ?? (isMobile ? AccountIcon : user.name)} startIcon={isMobile ? undefined : AccountIcon}>
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
                {children}
                <Separator />
                {user.impersonated && (
                    <>
                        <StopImpersonationButton
                            startIcon={<Clear />}
                            fullWidth
                            variant="outlined"
                            color="primary"
                            sx={{ justifyContent: "center" }}
                        />
                        <Separator />
                    </>
                )}
                {isSigningOut ? (
                    <Loading />
                ) : (
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<Logout />}
                        onClick={async () => {
                            const result = await signOut();
                            if (result.data) {
                                location.href = result.data.currentUserSignOut;
                            }
                        }}
                        sx={{ justifyContent: "center" }}
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
