import { useEditDialog, useSnackbarApi } from "@comet/admin";
import { AddFolder as AddFolderIcon, Archive, Delete, Download, Move, Restore, Upload } from "@comet/admin-icons";
import { Box, Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Slide, Snackbar, Typography } from "@mui/material";
import { PopoverOrigin } from "@mui/material/Popover/Popover";
import { SlideProps } from "@mui/material/Slide/Slide";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { FormattedMessage, useIntl } from "react-intl";

import { useDamAcceptedMimeTypes } from "../../config/useDamAcceptedMimeTypes";
import { useFileUpload } from "../fileUpload/useFileUpload";
import { useDamSelectionApi } from "./DamSelectionContext";

interface DamMoreActionsProps {
    transformOrigin?: PopoverOrigin;
    anchorOrigin?: PopoverOrigin;
    button: React.ReactElement;
    folderId?: string;
    filter?: {
        allowedMimetypes?: string[];
    };
}

export const DamMoreActions = ({ button, transformOrigin, anchorOrigin, folderId, filter }: DamMoreActionsProps): React.ReactElement => {
    const damSelectionActionsApi = useDamSelectionApi();
    const { selectionMap, archiveSelected, deleteSelected, downloadSelected, restoreSelected, moveSelected } = damSelectionActionsApi;
    const snackbarApi = useSnackbarApi();
    const [, , editDialogApi] = useEditDialog();
    const intl = useIntl();
    const { allAcceptedMimeTypes } = useDamAcceptedMimeTypes();

    const folderInputRef = React.useRef<HTMLInputElement>(null);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const selectionSize = selectionMap.size;
    const itemsSelected = !!selectionSize;
    const selectionMapValues = Array.from(selectionMap.values());
    const lengthOfSelectedFiles = selectionMapValues.filter((value) => value === "file").length;
    const onlyFoldersSelected = selectionMapValues.every((value) => value === "folder");

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDownloadClick = () => {
        const isFolderInSelection = selectionMapValues.some((value) => value === "folder");
        const snackbarElement = (
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

        downloadSelected();
        handleClose();
        isFolderInSelection && snackbarApi.showSnackbar(snackbarElement);
    };

    const handleUploadFolderClick = () => {
        folderInputRef.current?.click();
        handleClose();
    };

    const handleAddFolderClick = () => {
        editDialogApi.openAddDialog(folderId);
        handleClose();
    };

    const handleMoveClick = () => {
        moveSelected();
        handleClose();
    };

    const handleArchiveClick = () => {
        archiveSelected();
        handleClose();
    };

    const handleRestoreClick = () => {
        restoreSelected();
        handleClose();
    };

    const handleDeleteClick = () => {
        deleteSelected();
        handleClose();
    };

    const {
        uploadFiles,
        dialogs: fileUploadDialogs,
        dropzoneConfig,
    } = useFileUpload({
        acceptedMimetypes: filter?.allowedMimetypes ?? allAcceptedMimeTypes,
    });

    const { getInputProps } = useDropzone({
        ...dropzoneConfig,
        onDrop: async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            await uploadFiles({ acceptedFiles, fileRejections }, { folderId: folderId });
        },
    });

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
                <Box px={3}>
                    <Typography variant="subtitle2" color={(theme) => theme.palette.grey[500]} fontWeight="bold" mt={5}>
                        <FormattedMessage id="comet.dam.moreActions.overallActions" defaultMessage="Overall actions" />
                    </Typography>
                    <MenuList>
                        <MenuItem disabled={itemsSelected} onClick={handleUploadFolderClick}>
                            <ListItemIcon>
                                <Upload />
                            </ListItemIcon>
                            <ListItemText primary={<FormattedMessage id="comet.dam.moreActions.uploadFolder" defaultMessage="Upload folder" />} />
                        </MenuItem>

                        <MenuItem disabled={itemsSelected} onClick={handleAddFolderClick}>
                            <ListItemIcon>
                                <AddFolderIcon />
                            </ListItemIcon>
                            <FormattedMessage id="comet.pages.dam.addFolder" defaultMessage="Add Folder" />
                        </MenuItem>
                    </MenuList>
                    <Divider sx={{ my: 1, borderColor: (theme) => theme.palette.grey[50] }} />
                    <Typography variant="subtitle2" color={(theme) => theme.palette.grey[500]} fontWeight="bold" mt={5}>
                        <FormattedMessage id="comet.dam.moreActions.selectiveActions" defaultMessage="Selective actions" />
                    </Typography>
                    <MenuList>
                        {!onlyFoldersSelected && (
                            <>
                                <MenuItem onClick={handleDownloadClick}>
                                    <ListItemIcon>
                                        <Download />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<FormattedMessage id="comet.dam.moreActions.downloadSelected" defaultMessage="Download" />}
                                    />
                                    <NumberSelectedChip>{lengthOfSelectedFiles}</NumberSelectedChip>
                                </MenuItem>
                                <Divider sx={{ my: 1, borderColor: (theme) => theme.palette.grey[50] }} />
                            </>
                        )}
                        <MenuItem disabled={!itemsSelected} onClick={handleMoveClick}>
                            <ListItemIcon>
                                <Move />
                            </ListItemIcon>
                            <ListItemText primary={<FormattedMessage id="comet.dam.moreActions.moveItems" defaultMessage="Move" />} />
                            {itemsSelected && <NumberSelectedChip>{selectionSize}</NumberSelectedChip>}
                        </MenuItem>
                        <MenuItem disabled={!itemsSelected} onClick={handleArchiveClick}>
                            <ListItemIcon>
                                <Archive />
                            </ListItemIcon>
                            <ListItemText primary={<FormattedMessage id="comet.dam.moreActions.archiveItems" defaultMessage="Archive" />} />
                            {itemsSelected && <NumberSelectedChip>{selectionSize}</NumberSelectedChip>}
                        </MenuItem>
                        <MenuItem disabled={!itemsSelected} onClick={handleRestoreClick}>
                            <ListItemIcon>
                                <Restore />
                            </ListItemIcon>
                            <ListItemText primary={<FormattedMessage id="comet.dam.moreActions.restoreItems" defaultMessage="Restore" />} />
                            {itemsSelected && <NumberSelectedChip>{selectionSize}</NumberSelectedChip>}
                        </MenuItem>
                        <MenuItem disabled={!itemsSelected} onClick={handleDeleteClick}>
                            <ListItemIcon>
                                <Delete />
                            </ListItemIcon>
                            <ListItemText primary={<FormattedMessage id="comet.dam.moreActions.deleteItems" defaultMessage="Delete" />} />
                            {itemsSelected && <NumberSelectedChip>{selectionSize}</NumberSelectedChip>}
                        </MenuItem>
                    </MenuList>
                </Box>
            </Menu>

            {/* the directory property is needed for the folder upload to work but not known to eslint */}
            {/* eslint-disable-next-line react/no-unknown-property */}
            <input type="file" hidden {...getInputProps()} webkitdirectory="webkitdirectory" directory="directory" ref={folderInputRef} />
            {fileUploadDialogs}
        </>
    );
};

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
