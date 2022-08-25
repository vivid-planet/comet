import { ApolloClient, RefetchQueriesOptions, useApolloClient } from "@apollo/client";
import { Copy, Delete as DeleteIcon, Domain, MoreVertical, Paste, ThreeDotSaving } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { readClipboardText } from "../clipboard/readClipboardText";
import { writeClipboardText } from "../clipboard/writeClipboardText";
import { useErrorDialog } from "../error/errordialog/useErrorDialog";

interface DeleteDialogProps {
    dialogOpen: boolean;
    handleNoClick: () => void;
    handleYesClick: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = (props) => {
    const { dialogOpen, handleNoClick, handleYesClick } = props;

    return (
        <Dialog open={dialogOpen} onClose={handleNoClick}>
            <DialogTitle>
                <FormattedMessage id="comet.table.deleteDialog.title" defaultMessage="Delete item?" />
            </DialogTitle>
            <DialogContent>
                <FormattedMessage id="comet.table.deleteDialog.content" defaultMessage="WARNING: This cannot be undone!" />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleYesClick} color="primary" variant="contained">
                    <FormattedMessage id="comet.generic.yes" defaultMessage="Yes" />
                </Button>
                <Button onClick={handleNoClick} color="primary">
                    <FormattedMessage id="comet.generic.no" defaultMessage="No" />
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export interface CrudContextMenuProps {
    url?: string;
    onPaste?: (options: { input: unknown; client: ApolloClient<object> }) => Promise<void>;
    onDelete?: (options: { id: unknown; client: ApolloClient<object> }) => Promise<void>;
    id: string | number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetchQueries: RefetchQueriesOptions<any, unknown>["include"];
    copyData?: unknown;
}

export function CrudContextMenu({ url, id, onPaste, onDelete, refetchQueries, copyData }: CrudContextMenuProps): React.ReactElement {
    const intl = useIntl();
    const client = useApolloClient();
    const errorDialog = useErrorDialog();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [copyLoading, setCopyLoading] = React.useState(false);
    const [pasting, setPasting] = React.useState(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteClick = async () => {
        if (!onDelete) return;
        await onDelete({
            id,
            client,
        });
        await client.refetchQueries({ include: refetchQueries });
        setDeleteDialogOpen(false);
    };

    const handlePasteClick = async () => {
        if (!onPaste) return;
        const clipboard = await readClipboardText();

        if (clipboard) {
            let input;

            try {
                input = JSON.parse(clipboard);
            } catch (e) {
                errorDialog?.showError({
                    userMessage: <FormattedMessage id="comet.common.clipboardInvalidFormat" defaultMessage="Clipboard contains an invalid format" />,
                    error: e.toString(),
                });
                console.error("Bad clidpboard value, parsing JSON failed", e);
            }

            if (input) {
                // TODO validate input?
                try {
                    await onPaste({
                        input,
                        client,
                    });
                    await client.refetchQueries({ include: refetchQueries });
                } catch (e) {
                    errorDialog?.showError({
                        userMessage: (
                            <FormattedMessage
                                id="comet.common.pasteFailedInvalidFormat"
                                defaultMessage="Paste failed, probably due to an invalid format"
                            />
                        ),
                        error: e.toString(),
                    });
                    console.error("mutation failed", e);
                }
            }
        } else {
            console.error("Clidpboard is empty");
        }
    };

    const handleCopyClick = async () => {
        await writeClipboardText(JSON.stringify(copyData));
    };

    return (
        <>
            <IconButton onClick={handleClick} size="large">
                <MoreVertical />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {url && (
                    <MenuItem
                        key="copyUrl"
                        onClick={() => {
                            handleClose();
                            writeClipboardText(url);
                        }}
                    >
                        <ListItemIcon>
                            <Domain />
                        </ListItemIcon>
                        <ListItemText primary={intl.formatMessage({ id: "comet.generic.copyUrl", defaultMessage: "Copy Url" })} />
                    </MenuItem>
                )}
                {copyData && (
                    <MenuItem
                        onClick={async () => {
                            setCopyLoading(true);
                            await handleCopyClick();
                            setCopyLoading(false);
                            handleClose();
                        }}
                    >
                        <ListItemIcon>{!copyLoading ? <Copy /> : <ThreeDotSaving />}</ListItemIcon>
                        <ListItemText primary={intl.formatMessage({ id: "comet.generic.copy", defaultMessage: "Copy" })} />
                    </MenuItem>
                )}
                {onPaste && (
                    <MenuItem
                        key="paste"
                        onClick={async () => {
                            setPasting(true);
                            await handlePasteClick();
                            setPasting(false);
                            handleClose();
                        }}
                    >
                        <ListItemIcon>{!pasting ? <Paste /> : <ThreeDotSaving />}</ListItemIcon>
                        <ListItemText primary={intl.formatMessage({ id: "comet.generic.paste", defaultMessage: "Paste" })} />
                    </MenuItem>
                )}
                {onDelete && (
                    <MenuItem
                        onClick={() => {
                            handleClose();
                            setDeleteDialogOpen(true);
                        }}
                    >
                        <ListItemIcon>
                            <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText primary={intl.formatMessage({ id: "comet.generic.deleteItem", defaultMessage: "Delete item" })} />
                    </MenuItem>
                )}
            </Menu>
            <DeleteDialog
                dialogOpen={deleteDialogOpen}
                handleNoClick={() => {
                    setDeleteDialogOpen(false);
                }}
                handleYesClick={handleDeleteClick}
            />
        </>
    );
}
