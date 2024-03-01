import { gql, useApolloClient } from "@apollo/client";
import { RowActionsItem, RowActionsMenu, useEditDialogApi, useErrorDialog, useStackSwitchApi } from "@comet/admin";
import { Archive, Delete, Download, Edit, Move, Restore } from "@comet/admin-icons";
import { Divider } from "@mui/material";
import { saveAs } from "file-saver";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { useCmsBlockContext } from "../../blocks/useCmsBlockContext";
import { UnknownError } from "../../common/errors/errorMessages";
import { GQLDamFile, GQLDamFolder } from "../../graphql.generated";
import { ConfirmDeleteDialog } from "../FileActions/ConfirmDeleteDialog";
import { clearDamItemCache } from "../helpers/clearDamItemCache";
import { GQLDeleteDamFolderMutation, GQLDeleteDamFolderMutationVariables } from "./DamContextMenu.generated";
import { archiveDamFileMutation, deleteDamFileMutation, restoreDamFileMutation } from "./DamContextMenu.gql";
import {
    GQLArchiveFileMutation,
    GQLArchiveFileMutationVariables,
    GQLDeleteDamFileMutation,
    GQLDeleteDamFileMutationVariables,
    GQLRestoreFileMutation,
    GQLRestoreFileMutationVariables,
} from "./DamContextMenu.gql.generated";

interface FolderInnerMenuProps {
    folder: Pick<GQLDamFile, "id" | "name">;
    openMoveDialog: (itemToMove: { id: string; type: "file" | "folder" }) => void;
}

const FolderInnerMenu = ({ folder, openMoveDialog }: FolderInnerMenuProps): React.ReactElement => {
    const editDialogApi = useEditDialogApi();
    const errorDialog = useErrorDialog();
    const apolloClient = useApolloClient();
    const context = useCmsBlockContext();

    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);

    const handleFolderDelete = async () => {
        const { data } = await apolloClient.mutate<GQLDeleteDamFolderMutation, GQLDeleteDamFolderMutationVariables>({
            mutation: gql`
                mutation DeleteDamFolder($id: ID!) {
                    deleteSuccessful: deleteDamFolder(id: $id)
                }
            `,
            variables: { id: folder.id },
            refetchQueries: ["DamItemsList"],
            update: (cache) => {
                clearDamItemCache(cache);
            },
        });

        if (!data?.deleteSuccessful) {
            errorDialog?.showError({
                error: "",
                title: <FormattedMessage id="comet.pages.dam.deleteFolderError.title" defaultMessage="Folder could not be deleted" />,
                userMessage: <UnknownError />,
            });
        }
    };

    const downloadUrl = `${context.damConfig.apiUrl}/dam/folders/${folder.id}/zip`;

    return (
        <>
            <RowActionsMenu>
                <RowActionsMenu>
                    <RowActionsItem
                        icon={<Edit />}
                        onClick={() => {
                            editDialogApi?.openEditDialog(folder.id);
                        }}
                    >
                        <FormattedMessage id="comet.pages.dam.rename" defaultMessage="Rename" />
                    </RowActionsItem>
                    <RowActionsItem<"a">
                        icon={<Download />}
                        componentsProps={{
                            menuItem: { component: "a", href: downloadUrl, target: "_blank" },
                        }}
                    >
                        <FormattedMessage id="comet.pages.dam.downloadFolder" defaultMessage="Download folder" />
                    </RowActionsItem>
                    <RowActionsItem
                        icon={<Move />}
                        onClick={() => {
                            openMoveDialog({ id: folder.id, type: "folder" });
                        }}
                    >
                        <FormattedMessage id="comet.pages.dam.move" defaultMessage="Move" />
                    </RowActionsItem>
                    <Divider />
                    <RowActionsItem
                        icon={<Delete />}
                        onClick={() => {
                            setDeleteDialogOpen(true);
                        }}
                    >
                        <FormattedMessage id="comet.pages.dam.delete" defaultMessage="Delete" />
                    </RowActionsItem>
                </RowActionsMenu>
            </RowActionsMenu>
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

interface FileInnerMenuProps {
    file: Pick<GQLDamFile, "id" | "name" | "fileUrl" | "archived">;
    openMoveDialog: (itemToMove: { id: string; type: "file" | "folder" }) => void;
}

const FileInnerMenu = ({ file, openMoveDialog }: FileInnerMenuProps): React.ReactElement => {
    const client = useApolloClient();
    const stackApi = useStackSwitchApi();

    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);

    return (
        <>
            <RowActionsMenu>
                <RowActionsMenu>
                    <RowActionsItem
                        icon={<Edit />}
                        onClick={() => {
                            stackApi.activatePage("edit", file.id);
                        }}
                    >
                        <FormattedMessage id="comet.pages.dam.showEdit" defaultMessage="Show/edit" />
                    </RowActionsItem>
                    <RowActionsItem
                        icon={<Move />}
                        onClick={() => {
                            openMoveDialog({ id: file.id, type: "file" });
                        }}
                    >
                        <FormattedMessage id="comet.pages.dam.moveFile" defaultMessage="Move file" />
                    </RowActionsItem>
                    <RowActionsItem
                        icon={<Download />}
                        onClick={() => {
                            saveAs(file.fileUrl, file.name);
                        }}
                    >
                        <FormattedMessage id="comet.pages.dam.downloadFile" defaultMessage="Download file" />
                    </RowActionsItem>
                    <RowActionsItem
                        icon={file.archived ? <Restore /> : <Archive />}
                        onClick={() => {
                            if (file.archived) {
                                client.mutate<GQLRestoreFileMutation, GQLRestoreFileMutationVariables>({
                                    mutation: restoreDamFileMutation,
                                    variables: { id: file.id },
                                    refetchQueries: ["DamItemsList"],
                                });
                            } else {
                                client.mutate<GQLArchiveFileMutation, GQLArchiveFileMutationVariables>({
                                    mutation: archiveDamFileMutation,
                                    variables: { id: file.id },
                                    refetchQueries: ["DamItemsList"],
                                });
                            }
                        }}
                    >
                        {file.archived ? (
                            <FormattedMessage id="comet.pages.dam.restoreFile" defaultMessage="Restore file" />
                        ) : (
                            <FormattedMessage id="comet.pages.dam.archiveFile" defaultMessage="Archive file" />
                        )}
                    </RowActionsItem>
                    <Divider />
                    <RowActionsItem
                        icon={<Delete />}
                        onClick={() => {
                            setDeleteDialogOpen(true);
                        }}
                    >
                        <FormattedMessage id="comet.pages.dam.deleteFile" defaultMessage="Delete file" />
                    </RowActionsItem>
                </RowActionsMenu>
            </RowActionsMenu>
            <ConfirmDeleteDialog
                open={deleteDialogOpen}
                onCloseDialog={async (confirmed) => {
                    if (confirmed) {
                        await client.mutate<GQLDeleteDamFileMutation, GQLDeleteDamFileMutationVariables>({
                            mutation: deleteDamFileMutation,
                            variables: { id: file.id },
                            refetchQueries: ["DamItemsList"],
                            update: (cache) => {
                                clearDamItemCache(cache);
                            },
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

interface DamContextMenuProps {
    file?: Pick<GQLDamFile, "id" | "name" | "fileUrl" | "archived">;
    folder?: Pick<GQLDamFolder, "id" | "name">;
    openMoveDialog: (itemToMove: { id: string; type: "file" | "folder" }) => void;
}

const DamContextMenu = ({ file, folder, openMoveDialog }: DamContextMenuProps): React.ReactElement | null => {
    if (folder !== undefined) {
        return <FolderInnerMenu folder={folder} openMoveDialog={openMoveDialog} />;
    } else if (file !== undefined) {
        return <FileInnerMenu file={file} openMoveDialog={openMoveDialog} />;
    }

    return null;
};

export default DamContextMenu;
