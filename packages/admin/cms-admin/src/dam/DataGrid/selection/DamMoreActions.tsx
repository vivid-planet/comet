import { Archive, Delete, Download, MoreVertical, MovePage, Restore } from "@comet/admin-icons";
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { useDamSelectionApi } from "./DamSelectionContext";

export const DamMoreActions = (): React.ReactElement => {
    const damSelectionActionsApi = useDamSelectionApi();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton onClick={handleClick}>
                <MoreVertical />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuList>
                    <MenuItem
                        onClick={() => {
                            damSelectionActionsApi.downloadSelected();
                            handleClose();
                        }}
                    >
                        <ListItemIcon>
                            <Download />
                        </ListItemIcon>
                        <ListItemText primary={<FormattedMessage id="comet.dam.moreActions.downloadSelected" defaultMessage="Download selected" />} />
                    </MenuItem>
                    <StyledDivider />
                    <MenuItem
                        onClick={() => {
                            damSelectionActionsApi.moveSelected();
                            handleClose();
                        }}
                    >
                        <ListItemIcon>
                            <MovePage />
                        </ListItemIcon>
                        <ListItemText primary={<FormattedMessage id="comet.dam.moreActions.moveItems" defaultMessage="Move items" />} />
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            damSelectionActionsApi.archiveSelected();
                            handleClose();
                        }}
                    >
                        <ListItemIcon>
                            <Archive />
                        </ListItemIcon>
                        <ListItemText primary={<FormattedMessage id="comet.dam.moreActions.archiveItems" defaultMessage="Archive items" />} />
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            damSelectionActionsApi.restoreSelected();
                            handleClose();
                        }}
                    >
                        <ListItemIcon>
                            <Restore />
                        </ListItemIcon>
                        <ListItemText primary={<FormattedMessage id="comet.dam.moreActions.restoreItems" defaultMessage="Restore items" />} />
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            damSelectionActionsApi.deleteSelected();
                            handleClose();
                        }}
                    >
                        <ListItemIcon>
                            <Delete />
                        </ListItemIcon>
                        <ListItemText primary={<FormattedMessage id="comet.dam.moreActions.deleteItems" defaultMessage="Delete items" />} />
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    );
};

const StyledDivider = styled(Divider)`
    &.MuiDivider-root {
        border-color: ${({ theme }) => theme.palette.grey["50"]};
        margin: 8px 10px;
    }
`;
