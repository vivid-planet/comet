import { ApolloClient, RefetchQueriesOptions, useApolloClient } from "@apollo/client";
import { Copy, Delete as DeleteIcon, Domain, Paste, ThreeDotSaving } from "@comet/admin-icons";
import { Divider } from "@mui/material";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { readClipboardText } from "../clipboard/readClipboardText";
import { writeClipboardText } from "../clipboard/writeClipboardText";
import { DeleteDialog } from "../common/DeleteDialog";
import { useErrorDialog } from "../error/errordialog/useErrorDialog";
import { messages } from "../messages";
import { RowActionsItem } from "../rowActions/RowActionsItem";
import { RowActionsMenu } from "../rowActions/RowActionsMenu";

export interface CrudContextMenuProps<CopyData> {
    url?: string;
    onPaste?: (options: { input: CopyData; client: ApolloClient<object> }) => Promise<void>;
    onDelete?: (options: { client: ApolloClient<object> }) => Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetchQueries?: RefetchQueriesOptions<any, unknown>["include"];
    copyData?: () => Promise<CopyData> | CopyData;
}

export function CrudContextMenu<CopyData>({ url, onPaste, onDelete, refetchQueries, copyData }: CrudContextMenuProps<CopyData>) {
    const intl = useIntl();
    const client = useApolloClient();
    const errorDialog = useErrorDialog();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [copyLoading, setCopyLoading] = useState(false);
    const [pasting, setPasting] = useState(false);

    const handleDeleteClick = async () => {
        if (!onDelete) return;

        try {
            await onDelete({
                client,
            });
            if (refetchQueries) await client.refetchQueries({ include: refetchQueries });
            setDeleteDialogOpen(false);
        } catch (_) {
            throw new Error("Delete failed");
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
            <DeleteDialog dialogOpen={deleteDialogOpen} onCancel={() => setDeleteDialogOpen(false)} onDelete={handleDeleteClick} />
        </>
    );
}
