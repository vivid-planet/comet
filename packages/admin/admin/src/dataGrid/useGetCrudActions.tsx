import { ApolloClient, RefetchQueriesOptions, useApolloClient } from "@apollo/client";
import { Copy, Delete as DeleteIcon, Domain, Paste, ThreeDotSaving } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { GridActionsCellItem, GridActionsCellItemProps } from "@mui/x-data-grid";
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
                <Button onClick={onDelete} color="primary">
                    <FormattedMessage {...messages.no} />
                </Button>
                <Button onClick={onCancel} color="primary" variant="contained">
                    <FormattedMessage {...messages.yes} />
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
    refetchQueries?: RefetchQueriesOptions<any, unknown>["include"];
    copyData?: () => Promise<CopyData> | CopyData;
}

type Ret<CopyData> = (d: CrudContextMenuProps<CopyData>) => React.ReactElement<GridActionsCellItemProps>[];

export function useGetCrudActions<CopyData>(): Ret<CopyData> {
    const intl = useIntl();
    const client = useApolloClient();
    const errorDialog = useErrorDialog();

    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [copyLoading, setCopyLoading] = React.useState(false);
    const [pasting, setPasting] = React.useState(false);

    return ({ url, onPaste, onDelete, refetchQueries, copyData }) => {
        const handleDeleteClick = async () => {
            if (!onDelete) return;
            await onDelete({
                client,
            });
            if (refetchQueries) await client.refetchQueries({ include: refetchQueries });
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
                        userMessage: (
                            <FormattedMessage id="comet.common.clipboardInvalidFormat" defaultMessage="Clipboard contains an invalid format" />
                        ),
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

        const actionsProps: (Pick<GridActionsCellItemProps, "icon" | "label" | "onClick"> & { divider?: boolean })[] = [];

        if (url) {
            actionsProps.push({
                icon: <Domain />,
                label: intl.formatMessage(messages.copyUrl),
                onClick: () => {
                    writeClipboardText(url);
                },
            });
        }

        if (copyData) {
            actionsProps.push({
                icon: copyLoading ? <ThreeDotSaving /> : <Copy />,
                label: intl.formatMessage(messages.copy),
                onClick: async () => {
                    setCopyLoading(true);
                    await handleCopyClick();
                    setCopyLoading(false);
                },
            });
        }

        if (onPaste) {
            actionsProps.push({
                icon: pasting ? <ThreeDotSaving /> : <Paste />,
                label: intl.formatMessage(messages.paste),
                onClick: async () => {
                    setPasting(true);
                    await handlePasteClick();
                    setPasting(false);
                },
            });
        }

        if (onDelete && actionsProps.length) {
            actionsProps[actionsProps.length - 1]["divider"] = true;
        }

        const crudItems = actionsProps.map((props, index) => (
            // @ts-expect-error TODO: ¯\_(ツ)_/¯
            <GridActionsCellItem key={index} showInMenu {...props} onResize={undefined} onResizeCapture={undefined} />
        ));

        if (onDelete) {
            crudItems.push(
                // TODO: This does not work, the item replaces all previous `GridActionsCellItem` when rendered because of the fragment.
                <>
                    <DeleteDialog
                        dialogOpen={deleteDialogOpen}
                        onDelete={() => {
                            setDeleteDialogOpen(false);
                        }}
                        onCancel={handleDeleteClick}
                    />
                    <GridActionsCellItem
                        showInMenu
                        icon={<DeleteIcon />}
                        label={intl.formatMessage(messages.deleteItem)}
                        onClick={() => {
                            setDeleteDialogOpen(true);
                        }}
                        onResize={undefined}
                        onResizeCapture={undefined}
                    />
                </>,
            );
        }

        return crudItems;
    };
}
