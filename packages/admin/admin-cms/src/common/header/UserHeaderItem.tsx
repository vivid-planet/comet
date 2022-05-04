import { AppHeaderDropdown } from "@comet/admin";
import { Account, Info, Logout } from "@comet/admin-icons";
import { useAuthorization, useUser } from "@comet/react-app-auth";
import { Box, Button as MUIButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

import { AboutModal } from "./about/AboutModal";

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

export function UserHeaderItem(): React.ReactElement {
    const [showAboutModal, setShowAboutModal] = React.useState(false);
    const authorization = useAuthorization();
    const user = useUser();

    return (
        <AppHeaderDropdown buttonChildren={user?.name} startIcon={<Account />}>
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
                <Button
                    fullWidth
                    variant={"contained"}
                    color={"primary"}
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
                </Button>
            </DropdownContent>
            <AboutModal
                open={showAboutModal}
                onClose={() => {
                    setShowAboutModal(false);
                }}
            />
        </AppHeaderDropdown>
    );
}
