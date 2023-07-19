import { useSnackbarApi } from "@comet/admin";
import { Archive, Delete, Download, Move, Restore } from "@comet/admin-icons";
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Slide, Snackbar } from "@mui/material";
import { PopoverOrigin } from "@mui/material/Popover/Popover";
import { SlideProps } from "@mui/material/Slide/Slide";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useDamSelectionApi } from "./DamSelectionContext";

interface DamMoreActionsProps {
    transformOrigin?: PopoverOrigin;
    anchorOrigin?: PopoverOrigin;
    button: React.ReactElement;
}

export const DamMoreActions = ({ button, transformOrigin, anchorOrigin }: DamMoreActionsProps): React.ReactElement => {
    const damSelectionActionsApi = useDamSelectionApi();
    const snackbarApi = useSnackbarApi();
    const intl = useIntl();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const selectionMapValues = Array.from(damSelectionActionsApi.selectionMap.values());
    const lengthOfSelectedFiles = selectionMapValues.filter((value) => value === "file").length;
    const isFolderInSelection = selectionMapValues.some((value) => value === "folder");
    const onlyFoldersSelected = selectionMapValues.every((value) => value === "folder");

    const snackbarComponent = (
        <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            autoHideDuration={5000}
            TransitionComponent={(props: SlideProps) => <Slide {...props} direction="right" />}
            message={intl.formatMessage({
                id: "comet.dam.moreActions.folderNotDownloaded",
                defaultMessage: "Download of files started successfully. Folder downloads are not supported yet.",
            })}
        />
    );

    const onDownloadClick = () => {
        damSelectionActionsApi.downloadSelected();
        handleClose();
        isFolderInSelection && snackbarApi.showSnackbar(snackbarComponent);
    };

    const onMoveClick = () => {
        damSelectionActionsApi.moveSelected();
        handleClose();
    };

    const onArchiveClick = () => {
        damSelectionActionsApi.archiveSelected();
        handleClose();
    };

    const onRestoreClick = () => {
        damSelectionActionsApi.restoreSelected();
        handleClose();
    };

    const onDeleteClick = () => {
        damSelectionActionsApi.deleteSelected();
        handleClose();
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
                    {!onlyFoldersSelected && (
                        <>
                            <MenuItem onClick={onDownloadClick}>
                                <ListItemIcon>
                                    <Download />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<FormattedMessage id="comet.dam.moreActions.downloadSelected" defaultMessage="Download selected" />}
                                />
                                <NumberSelectedChip>{lengthOfSelectedFiles}</NumberSelectedChip>
                            </MenuItem>
                            <StyledDivider />
                        </>
                    )}
                    <MenuItem onClick={onMoveClick}>
                        <ListItemIcon>
                            <Move />
                        </ListItemIcon>
                        <ListItemText primary={<FormattedMessage id="comet.dam.moreActions.moveItems" defaultMessage="Move items" />} />
                        <NumberSelectedChip>{damSelectionActionsApi.selectionMap.size}</NumberSelectedChip>
                    </MenuItem>
                    <MenuItem onClick={onArchiveClick}>
                        <ListItemIcon>
                            <Archive />
                        </ListItemIcon>
                        <ListItemText primary={<FormattedMessage id="comet.dam.moreActions.archiveItems" defaultMessage="Archive items" />} />
                        <NumberSelectedChip>{damSelectionActionsApi.selectionMap.size}</NumberSelectedChip>
                    </MenuItem>
                    <MenuItem onClick={onRestoreClick}>
                        <ListItemIcon>
                            <Restore />
                        </ListItemIcon>
                        <ListItemText primary={<FormattedMessage id="comet.dam.moreActions.restoreItems" defaultMessage="Restore items" />} />
                        <NumberSelectedChip>{damSelectionActionsApi.selectionMap.size}</NumberSelectedChip>
                    </MenuItem>
                    <MenuItem onClick={onDeleteClick}>
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
