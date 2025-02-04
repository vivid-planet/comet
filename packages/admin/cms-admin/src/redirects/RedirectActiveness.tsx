import { gql, useMutation } from "@apollo/client";
import { Invisible, Visible } from "@comet/admin-icons";
import { Button, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { green } from "@mui/material/colors";
import { type MouseEvent, useState } from "react";
import { FormattedMessage } from "react-intl";

import {
    type GQLRedirectActivenessFragment,
    type GQLUpdateRedirectActivenessMutation,
    type GQLUpdateRedirectActivenessMutationVariables,
} from "./RedirectActiveness.generated";

const updateRedirectActivenessMutation = gql`
    mutation UpdateRedirectActiveness($id: ID!, $input: RedirectUpdateActivenessInput!) {
        updateRedirectActiveness(id: $id, input: $input) {
            id
            active
        }
    }
`;

export const redirectActivenessFragment = gql`
    fragment RedirectActiveness on Redirect {
        id
        active
    }
`;

interface RedirectActivenessProps {
    redirect: GQLRedirectActivenessFragment;
}

const RedirectActiveness = ({ redirect }: RedirectActivenessProps): JSX.Element => {
    const [updateRedirectActiveness] = useMutation<GQLUpdateRedirectActivenessMutation, GQLUpdateRedirectActivenessMutationVariables>(
        updateRedirectActivenessMutation,
    );
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleActivenessClick = (active: boolean) => {
        updateRedirectActiveness({
            variables: {
                id: redirect.id,
                input: { active: active },
            },
            optimisticResponse: {
                updateRedirectActiveness: {
                    __typename: "Redirect",
                    id: redirect.id,
                    active: active,
                },
            },
        });

        handleMenuClose();
    };

    return (
        <>
            <Button
                onClick={handleMenuOpen}
                startIcon={redirect.active ? <Visible style={{ color: green[500] }} /> : <Invisible color="disabled" />}
                color="info"
            >
                <FormattedMessage
                    id="comet.pages.redirects.redirect.activeness"
                    defaultMessage="{activeness, select, true {activated} other {deactivated} }"
                    values={{ activeness: redirect.active }}
                />
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleActivenessClick(true)} disabled={redirect.active}>
                    <ListItemIcon>
                        <Visible style={{ color: green[500] }} />
                    </ListItemIcon>
                    <FormattedMessage id="comet.pages.redirects.redirect.activate" defaultMessage="Activate" />
                </MenuItem>
                <MenuItem onClick={() => handleActivenessClick(false)} disabled={!redirect.active}>
                    <ListItemIcon>
                        <Invisible />
                    </ListItemIcon>
                    <FormattedMessage id="comet.pages.redirects.redirect.deactivate" defaultMessage="Deactivate" />
                </MenuItem>
            </Menu>
        </>
    );
};

export default RedirectActiveness;
