import { AppHeaderDropdown } from "@comet/admin";
import { Account, Info, Logout } from "@comet/admin-icons";
import { Box, Button as MUIButton, CircularProgress } from "@mui/material";
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

import { gql, useMutation, useQuery } from "@apollo/client";

import { GQLMeQuery, GQLSignOutMutation } from "../../graphql.generated";

const meQuery = gql`
    query Me {
        me {
            name
        }
    }
`;

const signOutMutation = gql`
    mutation SignOut {
        signOut
    }
`;

export function UserHeaderItem(): React.ReactElement {
    const [showAboutModal, setShowAboutModal] = React.useState(false);
    const { loading, data } = useQuery<GQLMeQuery>(meQuery);
    const [signOut, { loading: isSigningOut }] = useMutation<GQLSignOutMutation>(signOutMutation);

    if (loading || !data) return <CircularProgress />;

    return (
        <AppHeaderDropdown buttonChildren={data.me.name} startIcon={<Account />}>
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
                {isSigningOut && <CircularProgress />}
                {!isSigningOut && (
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        endIcon={<Logout />}
                        onClick={async () => {
                            const result = await signOut();
                            if (result.data) {
                                location.href = result.data.signOut;
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
            />
        </AppHeaderDropdown>
    );
}
