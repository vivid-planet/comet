import { Archive, Delete, Download, Move, Restore } from "@comet/admin-icons";
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from "@mui/material";
import { PopoverOrigin } from "@mui/material/Popover/Popover";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { useDamSelectionApi } from "./DamSelectionContext";

interface DamMoreActionsProps {
    transformOrigin?: PopoverOrigin;
    anchorOrigin?: PopoverOrigin;
    button: React.ReactElement;
}

export const DamMoreActions = ({ button, transformOrigin, anchorOrigin }: DamMoreActionsProps): React.ReactElement => {
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
            {React.cloneElement(button, { onClick: handleClick })}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                keepMounted={false}
                transformOrigin={transformOrigin}
                anchorOrigin={anchorOrigin}
            >
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
                        <NumberSelectedChip>{damSelectionActionsApi.selectionMap.size}</NumberSelectedChip>
                    </MenuItem>
                    <StyledDivider />
                    <MenuItem
                        onClick={() => {
                            damSelectionActionsApi.moveSelected();
                            handleClose();
                        }}
                    >
                        <ListItemIcon>
                            <Move />
                        </ListItemIcon>
                        <ListItemText primary={<FormattedMessage id="comet.dam.moreActions.moveItems" defaultMessage="Move items" />} />
                        <NumberSelectedChip>{damSelectionActionsApi.selectionMap.size}</NumberSelectedChip>
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
                        <NumberSelectedChip>{damSelectionActionsApi.selectionMap.size}</NumberSelectedChip>
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
                        <NumberSelectedChip>{damSelectionActionsApi.selectionMap.size}</NumberSelectedChip>
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
                        <NumberSelectedChip>{damSelectionActionsApi.selectionMap.size}</NumberSelectedChip>
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

const NumberSelectedChip = styled("div")`
    display: flex;
    align-items: center;
    height: 24px;
    background-color: ${({ theme }) => theme.palette.primary.main};
    margin-left: 10px;
    padding: 0 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 400;
    color: ${({ theme }) => theme.palette.grey[900]};
`;
