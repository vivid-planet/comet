import { ApolloClient, RefetchQueriesOptions, useApolloClient } from "@apollo/client";
import { Copy, Delete as DeleteIcon, Domain, MoreVertical, Paste, ThreeDotSaving } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { readClipboardText } from "../clipboard/readClipboardText";
import { writeClipboardText } from "../clipboard/writeClipboardText";
import { useErrorDialog } from "../error/errordialog/useErrorDialog";
import { messages } from "../messages";

interface DeleteDialogProps {
    dialogOpen: boolean;
    onDelete: () => void;
    onCancel: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = (props) => {
    const { dialogOpen, onDelete, onCancel } = props;

    return (
        <Dialog open={dialogOpen} onClose={onDelete}>
            <DialogTitle>
                <FormattedMessage id="comet.table.deleteDialog.title" defaultMessage="Delete item?" />
            </DialogTitle>
            <DialogContent>
                <FormattedMessage id="comet.table.deleteDialog.content" defaultMessage="WARNING: This cannot be undone!" />
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="primary" variant="contained">
                    <FormattedMessage {...messages.yes} />
                </Button>
                <Button onClick={onDelete} color="primary">
                    <FormattedMessage {...messages.no} />
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export interface CrudContextMenuProps<CopyData> {
    url?: string;
    onPaste?: (options: { input: CopyData; client: ApolloClient<object> }) => Promise<void>;
    onDelete?: (options: { client: ApolloClient<object> }) => Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetchQueries: RefetchQueriesOptions<any, unknown>["include"];
    copyData?: () => Promise<CopyData> | CopyData;
}

export function CrudContextMenu<CopyData>({ url, onPaste, onDelete, refetchQueries, copyData }: CrudContextMenuProps<CopyData>): React.ReactElement {
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
        await writeClipboardText(JSON.stringify(await copyData!()));
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
                        <ListItemText primary={intl.formatMessage(messages.copyUrl)} />
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
                        <ListItemText primary={intl.formatMessage(messages.copy)} />
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
                        <ListItemText primary={intl.formatMessage(messages.paste)} />
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
                        <ListItemText primary={intl.formatMessage(messages.deleteItem)} />
                    </MenuItem>
                )}
            </Menu>
            <DeleteDialog
                dialogOpen={deleteDialogOpen}
                onDelete={() => {
                    setDeleteDialogOpen(false);
                }}
                onCancel={handleDeleteClick}
            />
        </>
    );
}
