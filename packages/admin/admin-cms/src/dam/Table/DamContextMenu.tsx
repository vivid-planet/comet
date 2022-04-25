import { gql, useApolloClient } from "@apollo/client";
import { useEditDialogApi, useErrorDialog, useStackSwitchApi } from "@comet/admin";
import { Delete, Download, Edit, MoreVertical } from "@comet/admin-icons";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from "@mui/material";
import saveAs from "file-saver";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { UnknownError } from "../../common/errors/errorMessages";
import {
    GQLDamFile,
    GQLDamFolder,
    GQLDeleteDamFileMutation,
    GQLDeleteDamFileMutationVariables,
    GQLDeleteDamFolderMutation,
    GQLDeleteDamFolderMutationVariables,
    namedOperations,
} from "../../graphql.generated";
import { ConfirmDeleteDialog } from "../FileActions/ConfirmDeleteDialog";
import { deleteDamFileMutation } from "../FileActions/ConfirmDeleteDialog.gql";

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

const FolderInnerMenu = React.forwardRef(({ folder, handleClose }: FolderInnerMenuProps, ref): React.ReactElement => {
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
            refetchQueries: [namedOperations.Query.DamFoldersList],
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
                <ListItemText primary={intl.formatMessage({ id: "comet.pages.dam.edit", defaultMessage: "Edit" })} />
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
                    closeDialog={() => {
                        setDeleteDialogOpen(false);
                        handleClose();
                    }}
                    onDeleteButtonClick={handleFolderDelete}
                    name={folder.name}
                    assetType="folder"
                />
            </MenuItem>
        </MenuList>
    );
});

const FileInnerMenu = React.forwardRef(({ file, handleClose }: FileInnerMenuProps, ref): React.ReactElement => {
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
            {/*Todo: Readd Archive Button once archive filter exists*/}
            {/*<MenuItem*/}
            {/*    onClick={() => {*/}
            {/*        handleClose();*/}
            {/*        if (file.archived) {*/}
            {/*            client.mutate<GQLRestoreFileMutation, GQLRestoreFileMutationVariables>({*/}
            {/*                mutation: restoreDamFileMutation,*/}
            {/*                variables: { id: file.id },*/}
            {/*            });*/}
            {/*        } else {*/}
            {/*            client.mutate<GQLArchiveFileMutation, GQLArchiveFileMutationVariables>({*/}
            {/*                mutation: archiveDamFileMutation,*/}
            {/*                variables: { id: file.id },*/}
            {/*            });*/}
            {/*        }*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <ListItemIcon>{file.archived ? <Restore /> : <Archive />}</ListItemIcon>*/}
            {/*    <ListItemText*/}
            {/*        primary={*/}
            {/*            file.archived*/}
            {/*                ? intl.formatMessage({ id: "comet.pages.dam.restoreFile", defaultMessage: "Restore file" })*/}
            {/*                : intl.formatMessage({ id: "comet.pages.dam.archiveFile", defaultMessage: "Archive file" })*/}
            {/*        }*/}
            {/*    />*/}
            {/*</MenuItem>*/}
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
                    closeDialog={() => {
                        setDeleteDialogOpen(false);
                        handleClose();
                    }}
                    onDeleteButtonClick={async () => {
                        await client.mutate<GQLDeleteDamFileMutation, GQLDeleteDamFileMutationVariables>({
                            mutation: deleteDamFileMutation,
                            variables: { id: file.id },
                            refetchQueries: [namedOperations.Query.DamFilesList],
                        });
                    }}
                    name={file.name}
                    assetType="file"
                />
            </MenuItem>
        </MenuList>
    );
});

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
            <IconButton onClick={handleClick} size="large">
                <MoreVertical />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {innerMenu}
            </Menu>
        </>
    );
};

export default DamContextMenu;
