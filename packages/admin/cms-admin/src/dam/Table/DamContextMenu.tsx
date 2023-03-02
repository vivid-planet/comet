import { gql, useApolloClient } from "@apollo/client";
import { useEditDialogApi, useErrorDialog, useStackSwitchApi } from "@comet/admin";
import { Archive, Delete, Download, Edit, MoreVertical, Restore } from "@comet/admin-icons";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from "@mui/material";
import saveAs from "file-saver";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { UnknownError } from "../../common/errors/errorMessages";
import {
    GQLArchiveFileMutation,
    GQLArchiveFileMutationVariables,
    GQLDamFile,
    GQLDamFolder,
    GQLDeleteDamFileMutation,
    GQLDeleteDamFileMutationVariables,
    GQLDeleteDamFolderMutation,
    GQLDeleteDamFolderMutationVariables,
    GQLRestoreFileMutation,
    GQLRestoreFileMutationVariables,
    namedOperations,
} from "../../graphql.generated";
import { ConfirmDeleteDialog } from "../FileActions/ConfirmDeleteDialog";
import { archiveDamFileMutation, deleteDamFileMutation, restoreDamFileMutation } from "./DamContextMenu.gql";

interface DamContextMenuProps {
    file?: Pick<GQLDamFile, "id" | "name" | "fileUrl" | "archived">;
    folder?: Pick<GQLDamFolder, "id" | "name">;
}

interface FolderInnerMenuProps {
    folder: Pick<GQLDamFile, "id" | "name">;
    handleClose: () => void;
}

interface FileInnerMenuProps {
    file: Pick<GQLDamFile, "id" | "name" | "fileUrl" | "archived">;
    handleClose: () => void;
}

const FolderInnerMenu = ({ folder, handleClose }: FolderInnerMenuProps): React.ReactElement => {
    const intl = useIntl();
    const editDialogApi = useEditDialogApi();
    const errorDialog = useErrorDialog();
    const apolloClient = useApolloClient();

    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);

    const handleFolderDelete = async () => {
        const { data } = await apolloClient.mutate<GQLDeleteDamFolderMutation, GQLDeleteDamFolderMutationVariables>({
            mutation: gql`
                mutation DeleteDamFolder($id: ID!) {
                    deleteSuccessful: deleteDamFolder(id: $id)
                }
            `,
            variables: { id: folder.id },
            refetchQueries: [namedOperations.Query.DamItemsList],
        });

        if (!data?.deleteSuccessful) {
            errorDialog?.showError({
                error: "",
                title: <FormattedMessage id="comet.pages.dam.deleteFolderError.title" defaultMessage="Folder could not be deleted" />,
                userMessage: <UnknownError />,
            });
        }

        handleClose();
    };

    return (
        <MenuList>
            <MenuItem
                onClick={() => {
                    handleClose();
                    editDialogApi?.openEditDialog(folder.id);
                }}
            >
                <ListItemIcon>
                    <Edit />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: "comet.pages.dam.rename", defaultMessage: "Rename" })} />
            </MenuItem>
            <MenuItem
                onClick={() => {
                    setDeleteDialogOpen(true);
                }}
            >
                <ListItemIcon>
                    <Delete />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: "comet.pages.dam.delete", defaultMessage: "Delete" })} />
                <ConfirmDeleteDialog
                    open={deleteDialogOpen}
                    onCloseDialog={async (confirmed) => {
                        if (confirmed) {
                            await handleFolderDelete();
                        }
                        setDeleteDialogOpen(false);
                        handleClose();
                    }}
                    name={folder.name}
                    itemType="folder"
                />
            </MenuItem>
        </MenuList>
    );
};

const FileInnerMenu = ({ file, handleClose }: FileInnerMenuProps): React.ReactElement => {
    const client = useApolloClient();
    const intl = useIntl();
    const stackApi = useStackSwitchApi();

    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);

    return (
        <MenuList>
            <MenuItem
                onClick={() => {
                    handleClose();
                    stackApi.activatePage("edit", file.id);
                }}
            >
                <ListItemIcon>
                    <Edit />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: "comet.pages.dam.showEdit", defaultMessage: "Show/edit" })} />
            </MenuItem>
            <MenuItem
                onClick={() => {
                    handleClose();
                    saveAs(file.fileUrl, file.name);
                }}
            >
                <ListItemIcon>
                    <Download />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: "comet.pages.dam.downloadFile", defaultMessage: "Download file" })} />
            </MenuItem>
            <MenuItem
                onClick={() => {
                    handleClose();
                    if (file.archived) {
                        client.mutate<GQLRestoreFileMutation, GQLRestoreFileMutationVariables>({
                            mutation: restoreDamFileMutation,
                            variables: { id: file.id },
                            refetchQueries: [namedOperations.Query.DamItemsList],
                        });
                    } else {
                        client.mutate<GQLArchiveFileMutation, GQLArchiveFileMutationVariables>({
                            mutation: archiveDamFileMutation,
                            variables: { id: file.id },
                            refetchQueries: [namedOperations.Query.DamItemsList],
                        });
                    }
                }}
            >
                <ListItemIcon>{file.archived ? <Restore /> : <Archive />}</ListItemIcon>
                <ListItemText
                    primary={
                        file.archived
                            ? intl.formatMessage({ id: "comet.pages.dam.restoreFile", defaultMessage: "Restore file" })
                            : intl.formatMessage({ id: "comet.pages.dam.archiveFile", defaultMessage: "Archive file" })
                    }
                />
            </MenuItem>
            <MenuItem
                onClick={() => {
                    setDeleteDialogOpen(true);
                }}
            >
                <ListItemIcon>
                    <Delete />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: "comet.pages.dam.deleteFile", defaultMessage: "Delete file" })} />
                <ConfirmDeleteDialog
                    open={deleteDialogOpen}
                    onCloseDialog={async (confirmed) => {
                        if (confirmed) {
                            await client.mutate<GQLDeleteDamFileMutation, GQLDeleteDamFileMutationVariables>({
                                mutation: deleteDamFileMutation,
                                variables: { id: file.id },
                                refetchQueries: [namedOperations.Query.DamItemsList],
                            });
                        }

                        setDeleteDialogOpen(false);
                        handleClose();
                    }}
                    name={file.name}
                    itemType="file"
                />
            </MenuItem>
        </MenuList>
    );
};

const DamContextMenu = ({ file, folder }: DamContextMenuProps): React.ReactElement => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    let innerMenu = null;

    if (folder !== undefined) {
        innerMenu = <FolderInnerMenu folder={folder} handleClose={handleClose} />;
    } else if (file !== undefined) {
        innerMenu = <FileInnerMenu file={file} handleClose={handleClose} />;
    }

    return (
        <>
            <IconButton onClick={handleClick}>
                <MoreVertical />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {innerMenu}
            </Menu>
        </>
    );
};

export default DamContextMenu;
