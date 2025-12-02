import { CrudMoreActionsMenu, useEditDialog, useSnackbarApi } from "@comet/admin";
import { AddFolder as AddFolderIcon, Archive, Delete, Download, Move, Restore, Upload } from "@comet/admin-icons";
import { type PopoverOrigin, Slide, type SlideProps, Snackbar } from "@mui/material";
import { useRef } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
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

export const DamMoreActions = ({ transformOrigin, anchorOrigin, folderId, filter }: DamMoreActionsProps) => {
    const damSelectionActionsApi = useDamSelectionApi();
    const { selectionMap, archiveSelected, deleteSelected, downloadSelected, restoreSelected, moveSelected } = damSelectionActionsApi;
    const snackbarApi = useSnackbarApi();
    const [, , editDialogApi] = useEditDialog();
    const intl = useIntl();
    const { allAcceptedMimeTypes } = useDamAcceptedMimeTypes();

    const folderInputRef = useRef<HTMLInputElement>(null);

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
        if (isFolderInSelection) {
            snackbarApi.showSnackbar(snackbarElement);
        }
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
                overallActions={[
                    {
                        label: <FormattedMessage id="comet.dam.moreActions.uploadFolder" defaultMessage="Upload folder" />,
                        onClick: () => folderInputRef.current?.click(),
                        icon: <Upload />,
                    },
                    {
                        label: <FormattedMessage id="comet.pages.dam.addFolder" defaultMessage="Add Folder" />,
                        onClick: () => editDialogApi.openAddDialog(folderId),
                        icon: <AddFolderIcon />,
                    },
                ]}
                selectiveActions={[
                    !onlyFoldersSelected
                        ? {
                              label: <FormattedMessage id="comet.dam.moreActions.downloadSelected" defaultMessage="Download" />,
                              onClick: handleDownloadClick,
                              icon: <Download />,
                          }
                        : null,
                    {
                        label: <FormattedMessage id="comet.dam.moreActions.moveItems" defaultMessage="Move" />,
                        onClick: moveSelected,
                        icon: <Move />,
                        divider: true,
                    },
                    {
                        label: <FormattedMessage id="comet.dam.moreActions.archiveItems" defaultMessage="Archive" />,
                        onClick: archiveSelected,
                        icon: <Archive />,
                    },
                    {
                        label: <FormattedMessage id="comet.dam.moreActions.restoreItems" defaultMessage="Restore" />,
                        onClick: restoreSelected,
                        icon: <Restore />,
                    },
                    {
                        label: <FormattedMessage id="comet.dam.moreActions.deleteItems" defaultMessage="Delete" />,
                        onClick: deleteSelected,
                        icon: <Delete />,
                    },
                ]}
                selectionSize={selectionSize}
                slotProps={{
                    menu: {
                        transformOrigin,
                        anchorOrigin,
                    },
                    button: {
                        sx: {
                            marginLeft: 0,
                            marginRight: 0,
                        },
                    },
                }}
            />

            <input type="file" hidden {...getInputProps()} webkitdirectory="webkitdirectory" directory="directory" ref={folderInputRef} />
            {fileUploadDialogs}
        </>
    );
};
