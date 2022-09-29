import { gql, useApolloClient } from "@apollo/client";
import { RowActions, RowActionsMenuItem, useEditDialogApi, useErrorDialog, useStackSwitchApi } from "@comet/admin";
import { Archive, Delete, Download, Edit, Restore } from "@comet/admin-icons";
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

const FolderActions = ({ folder }: Required<Pick<DamContextMenuProps, "folder">>): React.ReactElement => {
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
    };

    const menuActions: RowActionsMenuItem[] = [
        {
            text: intl.formatMessage({ id: "comet.pages.dam.rename", defaultMessage: "Rename" }),
            icon: <Edit />,
            onClick: (_, closeMenu) => {
                closeMenu();
                editDialogApi?.openEditDialog(folder.id);
            },
        },
        {
            text: intl.formatMessage({ id: "comet.pages.dam.delete", defaultMessage: "Delete" }),
            icon: <Delete />,
            onClick: (_, closeMenu) => {
                closeMenu();
                setDeleteDialogOpen(true);
            },
        },
    ];

    return (
        <>
            <RowActions menuActions={menuActions} />
            <ConfirmDeleteDialog
                open={deleteDialogOpen}
                onCloseDialog={async (confirmed) => {
                    if (confirmed) {
                        await handleFolderDelete();
                    }
                    setDeleteDialogOpen(false);
                }}
                name={folder.name}
                itemType="folder"
            />
        </>
    );
};

const FileActions = ({ file }: Required<Pick<DamContextMenuProps, "file">>): React.ReactElement => {
    const client = useApolloClient();
    const intl = useIntl();
    const stackApi = useStackSwitchApi();

    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);

    const menuActions: RowActionsMenuItem[] = [
        {
            text: intl.formatMessage({ id: "comet.pages.dam.showEdit", defaultMessage: "Show/edit" }),
            icon: <Edit />,
            onClick: (_, closeMenu) => {
                closeMenu();
                stackApi.activatePage("edit", file.id);
            },
        },
        {
            text: intl.formatMessage({ id: "comet.pages.dam.downloadFile", defaultMessage: "Download file" }),
            icon: <Download />,
            onClick: (_, closeMenu) => {
                closeMenu();
                saveAs(file.fileUrl, file.name);
            },
        },
        {
            text: file.archived
                ? intl.formatMessage({ id: "comet.pages.dam.restoreFile", defaultMessage: "Restore file" })
                : intl.formatMessage({ id: "comet.pages.dam.archiveFile", defaultMessage: "Archive file" }),
            icon: file.archived ? <Restore /> : <Archive />,
            onClick: (_, closeMenu) => {
                closeMenu();
                if (file.archived) {
                    client.mutate<GQLRestoreFileMutation, GQLRestoreFileMutationVariables>({
                        mutation: restoreDamFileMutation,
                        variables: { id: file.id },
                    });
                } else {
                    client.mutate<GQLArchiveFileMutation, GQLArchiveFileMutationVariables>({
                        mutation: archiveDamFileMutation,
                        variables: { id: file.id },
                    });
                }
            },
        },
        {
            text: intl.formatMessage({ id: "comet.pages.dam.deleteFile", defaultMessage: "Delete file" }),
            icon: <Delete />,
            onClick: (_, closeMenu) => {
                closeMenu();
                setDeleteDialogOpen(true);
            },
        },
    ];

    return (
        <>
            <RowActions menuActions={menuActions} />
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
                }}
                name={file.name}
                itemType="file"
            />
        </>
    );
};

const DamContextMenu = ({ file, folder }: DamContextMenuProps): React.ReactElement | null => {
    if (folder !== undefined) {
        return <FolderActions folder={folder} />;
    } else if (file !== undefined) {
        return <FileActions file={file} />;
    }

    return null;
};

export default DamContextMenu;
