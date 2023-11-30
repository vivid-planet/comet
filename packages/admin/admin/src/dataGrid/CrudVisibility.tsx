import { Button, ListItemIcon, Menu, MenuItem } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { useSnackbarApi } from "../snackbar/SnackbarProvider";
import { UndoSnackbar } from "../snackbar/UndoSnackbar";
import { CrudVisibilityIcon } from "./CrudVisibilityIcon";

export interface CrudVisibilityProps {
    visibility: boolean;
    onUpdateVisibility: (visibility: boolean) => Promise<void>;
}

export const CrudVisibility = ({ visibility, onUpdateVisibility }: CrudVisibilityProps): React.ReactElement => {
    const snackbarApi = useSnackbarApi();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleVisibilityClick = (visibility: boolean) => {
        onUpdateVisibility(visibility);
        handleMenuClose();
        snackbarApi.showSnackbar(
            <UndoSnackbar
                message={
                    <FormattedMessage
                        id="comet.common.visibilityChanged"
                        defaultMessage="Changed visibility to {visibility, select, true {published} false {unpublished} other {unknown}}"
                        values={{
                            visibility,
                        }}
                    />
                }
                onUndoClick={() => {
                    onUpdateVisibility(!visibility);
                }}
            />,
        );
    };

    return (
        <>
            <Button size="small" onClick={handleMenuOpen} startIcon={<CrudVisibilityIcon visibility={visibility} />} color="info">
                <FormattedMessage
                    id="comet.common.visibility"
                    defaultMessage="{visibility, select, true {Published} false {Unpublished} other {unknown}}"
                    values={{
                        visibility,
                    }}
                />
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleVisibilityClick(true)} disabled={visibility == true}>
                    <ListItemIcon>
                        <CrudVisibilityIcon visibility={true} />
                    </ListItemIcon>
                    <FormattedMessage id="comet.common.visibility.published" defaultMessage="Published" />
                </MenuItem>
                <MenuItem onClick={() => handleVisibilityClick(false)} disabled={visibility == false}>
                    <ListItemIcon>
                        <CrudVisibilityIcon visibility={false} />
                    </ListItemIcon>
                    <FormattedMessage id="comet.common.visibility.unpublished" defaultMessage="Unpublished" />
                </MenuItem>
            </Menu>
        </>
    );
};
