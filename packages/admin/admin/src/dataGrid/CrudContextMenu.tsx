import { ApolloClient, RefetchQueriesOptions, useApolloClient } from "@apollo/client";
import { Copy, Delete as DeleteIcon, Domain, Paste, ThreeDotSaving } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Snackbar } from "@mui/material";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Alert } from "../alert/Alert";
import { readClipboardText } from "../clipboard/readClipboardText";
import { writeClipboardText } from "../clipboard/writeClipboardText";
import { FeedbackButton } from "../common/buttons/feedback/FeedbackButton";
import { useErrorDialog } from "../error/errordialog/useErrorDialog";
import { messages } from "../messages";
import { RowActionsItem } from "../rowActions/RowActionsItem";
import { RowActionsMenu } from "../rowActions/RowActionsMenu";
import { useSnackbarApi } from "../snackbar/SnackbarProvider";

interface DeleteDialogProps {
    dialogOpen: boolean;
    onDelete: () => void;
    onCancel: () => void;
    loading?: boolean;
}

const DeleteDialog: React.FC<DeleteDialogProps> = (props) => {
    const { dialogOpen, onDelete, onCancel, loading } = props;

    return (
        <Dialog open={dialogOpen} onClose={onDelete}>
            <DialogTitle>
                <FormattedMessage id="comet.table.deleteDialog.title" defaultMessage="Delete item?" />
            </DialogTitle>
            <DialogContent>
                <FormattedMessage id="comet.table.deleteDialog.content" defaultMessage="WARNING: This cannot be undone!" />
            </DialogContent>
            <DialogActions>
                <Button onClick={onDelete} color="primary">
                    <FormattedMessage {...messages.no} />
                </Button>
                <FeedbackButton startIcon={<DeleteIcon />} onClick={onCancel} color="primary" variant="contained" loading={loading}>
                    <FormattedMessage {...messages.yes} />
                </FeedbackButton>
            </DialogActions>
        </Dialog>
    );
};

const successSnackbar = (
    <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "left" }} autoHideDuration={5000}>
        <Alert severity="success">
            <FormattedMessage id="comet.common.deleteSuccess" defaultMessage="Sucessfully deleted" />
        </Alert>
    </Snackbar>
);

const errorSnackbar = (
    <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "left" }} autoHideDuration={5000}>
        <Alert severity="error">
            <FormattedMessage id="comet.common.deleteFailed" defaultMessage="Failed to delete" />
        </Alert>
    </Snackbar>
);

export interface CrudContextMenuProps<CopyData> {
    url?: string;
    onPaste?: (options: { input: CopyData; client: ApolloClient<object> }) => Promise<void>;
    onDelete?: (options: { client: ApolloClient<object> }) => Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetchQueries?: RefetchQueriesOptions<any, unknown>["include"];
    copyData?: () => Promise<CopyData> | CopyData;
}

export function CrudContextMenu<CopyData>({ url, onPaste, onDelete, refetchQueries, copyData }: CrudContextMenuProps<CopyData>): React.ReactElement {
    const intl = useIntl();
    const client = useApolloClient();
    const errorDialog = useErrorDialog();
    const { showSnackbar } = useSnackbarApi();

    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [copyLoading, setCopyLoading] = React.useState(false);
    const [pasting, setPasting] = React.useState(false);
    const [deleteLoading, setDeleteLoading] = React.useState(false);

    const handleDeleteClick = async () => {
        if (!onDelete) return;
        try {
            setDeleteLoading(true);
            await onDelete({
                client,
            });
            if (refetchQueries) await client.refetchQueries({ include: refetchQueries });
            setDeleteLoading(false);
            setDeleteDialogOpen(false);
            showSnackbar(successSnackbar);
        } catch (_) {
            setDeleteLoading(false);
            showSnackbar(errorSnackbar);
            setDeleteDialogOpen(false);
        }
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
                    if (refetchQueries) await client.refetchQueries({ include: refetchQueries });
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
            <RowActionsMenu>
                <RowActionsMenu>
                    {url && (
                        <RowActionsItem
                            icon={<Domain />}
                            onClick={() => {
                                writeClipboardText(url);
                            }}
                        >
                            {intl.formatMessage(messages.copyUrl)}
                        </RowActionsItem>
                    )}
                    {copyData && (
                        <RowActionsItem
                            icon={copyLoading ? <ThreeDotSaving /> : <Copy />}
                            onClick={async () => {
                                setCopyLoading(true);
                                await handleCopyClick();
                                setCopyLoading(false);
                            }}
                        >
                            {intl.formatMessage(messages.copy)}
                        </RowActionsItem>
                    )}
                    {onPaste && (
                        <RowActionsItem
                            icon={pasting ? <ThreeDotSaving /> : <Paste />}
                            onClick={async () => {
                                setPasting(true);
                                await handlePasteClick();
                                setPasting(false);
                            }}
                        >
                            {intl.formatMessage(messages.paste)}
                        </RowActionsItem>
                    )}
                    {onDelete && (onPaste || copyData || url) && <Divider />}
                    {onDelete && (
                        <RowActionsItem
                            icon={<DeleteIcon />}
                            onClick={() => {
                                setDeleteDialogOpen(true);
                            }}
                        >
                            {intl.formatMessage(messages.deleteItem)}
                        </RowActionsItem>
                    )}
                </RowActionsMenu>
            </RowActionsMenu>
            <DeleteDialog
                dialogOpen={deleteDialogOpen}
                onDelete={() => {
                    setDeleteDialogOpen(false);
                }}
                onCancel={handleDeleteClick}
                loading={deleteLoading}
            />
        </>
    );
}
