import { CrudMoreActionsMenu, useEditDialog, useSnackbarApi } from "@comet/admin";
import { AddFolder as AddFolderIcon, Archive, Delete, Download, Move, Restore, Upload } from "@comet/admin-icons";
import { Slide, Snackbar } from "@mui/material";
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
    const selectionMapValues = Array.from(selectionMap.values());
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
            <CrudMoreActionsMenu
                overallItems={[
                    {
                        type: "action",
                        label: <FormattedMessage id="comet.dam.moreActions.uploadFolder" defaultMessage="Upload folder" />,
                        onClick: () => folderInputRef.current?.click(),
                        startAdornment: <Upload />,
                    },
                    {
                        type: "action",
                        label: <FormattedMessage id="comet.pages.dam.addFolder" defaultMessage="Add Folder" />,
                        onClick: () => editDialogApi.openAddDialog(folderId),
                        startAdornment: <AddFolderIcon />,
                    },
                ]}
                selectiveItems={[
                    !onlyFoldersSelected
                        ? {
                              type: "action",
                              label: <FormattedMessage id="comet.dam.moreActions.downloadSelected" defaultMessage="Download" />,
                              onClick: handleDownloadClick,
                              startAdornment: <Download />,
                          }
                        : null,
                    {
                        type: "action",
                        label: <FormattedMessage id="comet.dam.moreActions.moveItems" defaultMessage="Move" />,
                        onClick: moveSelected,
                        startAdornment: <Move />,
                    },
                    {
                        type: "action",
                        label: <FormattedMessage id="comet.dam.moreActions.archiveItems" defaultMessage="Archive" />,
                        onClick: archiveSelected,
                        startAdornment: <Archive />,
                    },
                    {
                        type: "divider",
                    },
                    {
                        type: "action",
                        label: <FormattedMessage id="comet.dam.moreActions.restoreItems" defaultMessage="Restore" />,
                        onClick: restoreSelected,
                        startAdornment: <Restore />,
                    },
                    {
                        type: "action",
                        label: <FormattedMessage id="comet.dam.moreActions.deleteItems" defaultMessage="Delete" />,
                        onClick: deleteSelected,
                        startAdornment: <Delete />,
                    },
                ]} // filter out null values
                selectionSize={selectionSize}
                menuProps={{
                    transformOrigin,
                    anchorOrigin,
                }}
            />

            {/* the directory property is needed for the folder upload to work but not known to eslint */}
            {/* eslint-disable-next-line react/no-unknown-property */}
            <input type="file" hidden {...getInputProps()} webkitdirectory="webkitdirectory" directory="directory" ref={folderInputRef} />
            {fileUploadDialogs}
        </>
    );
};
