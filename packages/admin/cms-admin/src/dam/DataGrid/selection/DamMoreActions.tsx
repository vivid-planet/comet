import { MoreActionsDivider, MoreActionsGroup, MoreActionsMenu, useEditDialog, useSnackbarApi } from "@comet/admin";
import { AddFolder as AddFolderIcon, Archive, Delete, Download, Move, Restore, Upload } from "@comet/admin-icons";
import { ListItemIcon, ListItemText, MenuItem, Slide, Snackbar } from "@mui/material";
import { PopoverOrigin } from "@mui/material/Popover/Popover";
import { SlideProps } from "@mui/material/Slide/Slide";
import * as React from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { FormattedMessage, useIntl } from "react-intl";

import { useDamAcceptedMimeTypes } from "../../config/useDamAcceptedMimeTypes";
import { useDamFileUpload } from "../fileUpload/useDamFileUpload";
import { useDamSelectionApi } from "./DamSelectionContext";

interface DamMoreActionsProps {
    transformOrigin?: PopoverOrigin;
    anchorOrigin?: PopoverOrigin;
    folderId?: string;
    filter?: {
        allowedMimetypes?: string[];
    };
}

export const DamMoreActions = ({ transformOrigin, anchorOrigin, folderId, filter }: DamMoreActionsProps): React.ReactElement => {
    const damSelectionActionsApi = useDamSelectionApi();
    const { selectionMap, archiveSelected, deleteSelected, downloadSelected, restoreSelected, moveSelected } = damSelectionActionsApi;
    const snackbarApi = useSnackbarApi();
    const [, , editDialogApi] = useEditDialog();
    const intl = useIntl();
    const { allAcceptedMimeTypes } = useDamAcceptedMimeTypes();

    const folderInputRef = React.useRef<HTMLInputElement>(null);

    const selectionSize = selectionMap.size;
    const itemsSelected = !!selectionSize;
    const selectionMapValues = Array.from(selectionMap.values());
    const lengthOfSelectedFiles = selectionMapValues.filter((value) => value === "file").length;
    const onlyFoldersSelected = selectionMapValues.every((value) => value === "folder");

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
        isFolderInSelection && snackbarApi.showSnackbar(snackbarElement);
    };

    const {
        uploadFiles,
        dialogs: fileUploadDialogs,
        dropzoneConfig,
    } = useDamFileUpload({
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
            <MoreActionsMenu
                selectionSize={selectionSize}
                menuProps={{
                    transformOrigin,
                    anchorOrigin,
                }}
            >
                {({ handleClose, selectedItemsChip: SelectedItemsChip }) => (
                    <>
                        <MoreActionsGroup
                            groupTitle={<FormattedMessage id="comet.dam.moreActions.overallActions" defaultMessage="Overall actions" />}
                        >
                            <MenuItem
                                disabled={itemsSelected}
                                onClick={() => {
                                    folderInputRef.current?.click();
                                    handleClose();
                                }}
                            >
                                <ListItemIcon>
                                    <Upload />
                                </ListItemIcon>
                                <ListItemText primary={<FormattedMessage id="comet.dam.moreActions.uploadFolder" defaultMessage="Upload folder" />} />
                            </MenuItem>

                            <MenuItem
                                disabled={itemsSelected}
                                onClick={() => {
                                    editDialogApi.openAddDialog(folderId);
                                    handleClose();
                                }}
                            >
                                <ListItemIcon>
                                    <AddFolderIcon />
                                </ListItemIcon>
                                <FormattedMessage id="comet.pages.dam.addFolder" defaultMessage="Add Folder" />
                            </MenuItem>
                        </MoreActionsGroup>

                        <MoreActionsDivider />

                        <MoreActionsGroup
                            groupTitle={<FormattedMessage id="comet.dam.moreActions.selectiveActions" defaultMessage="Selective actions" />}
                        >
                            {!onlyFoldersSelected && (
                                <>
                                    <MenuItem
                                        onClick={() => {
                                            handleDownloadClick();
                                            handleClose();
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Download />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={<FormattedMessage id="comet.dam.moreActions.downloadSelected" defaultMessage="Download" />}
                                        />
                                        <SelectedItemsChip label={lengthOfSelectedFiles} />
                                    </MenuItem>
                                    <MoreActionsDivider />
                                </>
                            )}
                            <MenuItem
                                disabled={!itemsSelected}
                                onClick={() => {
                                    moveSelected();
                                    handleClose();
                                }}
                            >
                                <ListItemIcon>
                                    <Move />
                                </ListItemIcon>
                                <ListItemText primary={<FormattedMessage id="comet.dam.moreActions.moveItems" defaultMessage="Move" />} />
                                <SelectedItemsChip label={selectionSize} />
                            </MenuItem>
                            <MenuItem
                                disabled={!itemsSelected}
                                onClick={() => {
                                    archiveSelected();
                                    handleClose();
                                }}
                            >
                                <ListItemIcon>
                                    <Archive />
                                </ListItemIcon>
                                <ListItemText primary={<FormattedMessage id="comet.dam.moreActions.archiveItems" defaultMessage="Archive" />} />
                                <SelectedItemsChip label={selectionSize} />
                            </MenuItem>
                            <MenuItem
                                disabled={!itemsSelected}
                                onClick={() => {
                                    restoreSelected();
                                    handleClose();
                                }}
                            >
                                <ListItemIcon>
                                    <Restore />
                                </ListItemIcon>
                                <ListItemText primary={<FormattedMessage id="comet.dam.moreActions.restoreItems" defaultMessage="Restore" />} />
                                <SelectedItemsChip label={selectionSize} />
                            </MenuItem>
                            <MenuItem
                                disabled={!itemsSelected}
                                onClick={() => {
                                    deleteSelected();
                                    handleClose();
                                }}
                            >
                                <ListItemIcon>
                                    <Delete />
                                </ListItemIcon>
                                <ListItemText primary={<FormattedMessage id="comet.dam.moreActions.deleteItems" defaultMessage="Delete" />} />
                                <SelectedItemsChip label={selectionSize} />
                            </MenuItem>
                        </MoreActionsGroup>
                    </>
                )}
            </MoreActionsMenu>

            {/* the directory property is needed for the folder upload to work but not known to eslint */}
            {/* eslint-disable-next-line react/no-unknown-property */}
            <input type="file" hidden {...getInputProps()} webkitdirectory="webkitdirectory" directory="directory" ref={folderInputRef} />
            {fileUploadDialogs}
        </>
    );
};
