import { gql, useMutation } from "@apollo/client";
import { AppHeaderDropdown, AppHeaderDropdownProps, Loading } from "@comet/admin";
import { Account, ImpersonateUser, Logout } from "@comet/admin-icons";
import { Avatar, AvatarGroup, AvatarProps, Box, Button as MUIButton, useMediaQuery, useTheme } from "@mui/material";
import { css, styled } from "@mui/material/styles";
import { PropsWithChildren, ReactElement, useState } from "react";
import { FormattedMessage } from "react-intl";

import { version } from "../..";
import { useCurrentUser } from "../../userPermissions/hooks/currentUser";
import { AboutModal } from "./about/AboutModal";
import { ImpersonationInlay } from "./impersonation/ImpersonationInlay";
import { UserHeaderAccountIcon } from "./impersonation/UserHeaderAccountIcon";
import { GQLSignOutMutation } from "./UserHeaderItem.generated";

const DropdownContent = styled(Box)`
    width: 300px;
`;

const Button = styled(MUIButton)`
    justify-content: flex-start;
`;

const MenuFooter = styled(Box)`
    display: flex;
    padding-top: 10px;
    justify-content: space-between;
    align-items: center;
`;

const Separator = styled(Box)`
    background-color: ${(props) => props.theme.palette.grey["100"]};
    height: 1px;
    width: 100%;
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

interface StyledAvatarProps extends AvatarProps {
    active?: boolean;
    inactive?: boolean;
}
export function UserHeaderItem(props: PropsWithChildren<UserHeaderItemProps>) {
    const { aboutModalLogo, buttonChildren, children } = props;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const user = useCurrentUser();

    const [showAboutModal, setShowAboutModal] = useState(false);
    const [signOut, { loading: isSigningOut }] = useMutation<GQLSignOutMutation>(signOutMutation);

    const AccountIcon = user.impersonated ? (
        <AvatarGroup>
            <StyledAvatar inactive>
                <Account />
            </StyledAvatar>
            <StyledAvatar active>
                <ImpersonateUser />
            </StyledAvatar>
        </AvatarGroup>
    ) : (
        <StyledAvatar>
            <Account />
        </StyledAvatar>
    );
    return (
        <AppHeaderDropdown
            buttonChildren={buttonChildren ?? (isMobile ? <UserHeaderAccountIcon impersonated={user.impersonated} /> : user.name)}
            startIcon={isMobile ? undefined : <UserHeaderAccountIcon impersonated={user.impersonated} />}
        >
            <DropdownContent padding={0}>
                <Box padding={4}>
                    <Typography color="textSecondary" variant="caption" sx={{ paddingBottom: 2, display: "block" }}>
                        <FormattedMessage id="comet.logged.in" defaultMessage="Logged in as" />
                    </Typography>
                    <Typography variant="h4">{user.name}</Typography>
                    <Typography variant="body2">{user.email}</Typography>
                </Box>

                <Separator />

                {user.impersonated && <ImpersonationInlay />}
                {children && (
                    <>
                        <Box padding={4}>{children}</Box>
                        <Separator />
                    </>
                )}
                <Box padding={4}>
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
                    <MenuFooter>
                        <Typography variant="caption" fontWeight={300}>{`Version: v${version}`}</Typography>

                        <Button
                            variant="text"
                            onClick={() => {
                                setShowAboutModal(true);
                            }}
                            color="primary"
                            sx={{ padding: 0 }}
                        >
                            <Typography variant="caption" fontWeight={300}>
                                <FormattedMessage id="comet.about" defaultMessage="About/Copyright" />
                            </Typography>
                        </Button>
                    </MenuFooter>
                </Box>
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

const StyledAvatar = styled(Avatar)<StyledAvatarProps>`
    width: 32px;
    height: 32px;
    background-color: ${({ theme }) => theme.palette.grey[900]};

    && {
        border: 1px solid ${({ theme }) => theme.palette.grey[400]};
    }

    ${({ active, theme }) =>
        active &&
        css`
            margin-left: -10px;
            z-index: 1;

            && {
                border: 2px solid ${theme.palette.primary.main};
            }
        `}

    ${({ inactive }) =>
        inactive &&
        css`
            opacity: 50%;
        `}
`;
