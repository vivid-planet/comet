import { useEditDialogApi, useStackSwitchApi } from "@comet/admin";
import { Delete, Download, Edit, MoreVertical } from "@comet/admin-icons";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from "@material-ui/core";
import { saveAs } from "file-saver";
import * as React from "react";
import { useIntl } from "react-intl";

import { GQLDamFile, GQLDamFolder } from "../../graphql.generated";
import { ConfirmDeleteDialog } from "../FileActions/ConfirmDeleteDialog";

interface DamContextMenuProps {
    file?: Pick<GQLDamFile, "id" | "name" | "fileUrl" | "archived">;
    folder?: Pick<GQLDamFolder, "id">;
}

interface FolderInnerMenuProps {
    id: string;
    handleClose: () => void;
}

interface FileInnerMenuProps {
    file: Pick<GQLDamFile, "id" | "name" | "fileUrl" | "archived">;
    handleClose: () => void;
}

const FolderInnerMenu = React.forwardRef(({ id, handleClose }: FolderInnerMenuProps, ref): React.ReactElement => {
    const intl = useIntl();
    const editDialogApi = useEditDialogApi();

    return (
        <MenuList innerRef={ref}>
            <MenuItem
                onClick={() => {
                    handleClose();
                    editDialogApi?.openEditDialog(id);
                }}
            >
                <ListItemIcon>
                    <Edit />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: "comet.pages.dam.edit", defaultMessage: "Edit" })} />
            </MenuItem>
        </MenuList>
    );
});

const FileInnerMenu = React.forwardRef(({ file, handleClose }: FileInnerMenuProps, ref): React.ReactElement => {
    const intl = useIntl();
    const stackApi = useStackSwitchApi();

    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);

    return (
        <MenuList innerRef={ref}>
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
                    file={file}
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
        innerMenu = <FolderInnerMenu id={folder.id} handleClose={handleClose} />;
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
