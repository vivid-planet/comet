import { Alert, readClipboardText, RowActionsItem, RowActionsMenu, useSnackbarApi, writeClipboardText } from "@comet/admin";
import { Add, ArrowDown, ArrowUp, Copy, Delete, Duplicate, Paste, Remove } from "@comet/admin-icons";
import { DispatchSetStateAction } from "@comet/blocks-admin";
import { Divider, Snackbar } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { TableBlockData } from "../../blocks.generated";
import {
    ClipboardRow,
    clipboardRowSchema,
    deleteRowFromState,
    duplicateRowInState,
    insertNewRowIntoState,
    insertRowFromClipboardIntoState,
    toggleHighlightOfRowInState,
} from "./utils";

type Props = {
    row: Record<string, unknown> & { id: string };
    updateState: DispatchSetStateAction<TableBlockData>;
    state: TableBlockData;
};

export const ActionsCell = ({ row, updateState, state }: Props) => {
    const snackbarApi = useSnackbarApi();

    const duplicateRow = () => {
        const duplicationResult = duplicateRowInState(state, row.id);

        if (!duplicationResult.success) {
            snackbarApi.showSnackbar(
                <Snackbar autoHideDuration={5000}>
                    <Alert severity="error">
                        <FormattedMessage id="comet.tableBlock.failedToDuplicateRow" defaultMessage="Failed to duplicate row" />
                    </Alert>
                </Snackbar>,
            );
            return;
        }

        updateState(duplicationResult.state);
    };

    const copyRowToClipboard = () => {
        const rowToCopy = state.rows.find(({ id }) => id === row.id);
        if (!rowToCopy) {
            snackbarApi.showSnackbar(
                <Snackbar autoHideDuration={5000}>
                    <Alert severity="error">
                        <FormattedMessage id="comet.tableBlock.failedToCopyRow" defaultMessage="Failed to copy row" />
                    </Alert>
                </Snackbar>,
            );
            return;
        }

        const copyData: ClipboardRow = {
            highlighted: rowToCopy.highlighted,
            cellValues: state.columns.map(({ id: columnId }) => {
                const cellValue = rowToCopy.cellValues.find(({ columnId: cellColumnId }) => cellColumnId === columnId);
                return cellValue ? cellValue.value : "";
            }),
        };

        writeClipboardText(JSON.stringify(copyData));
    };

    const getRowFromClipboard = async (): Promise<ClipboardRow | undefined> => {
        const clipboardData = await readClipboardText();

        if (!clipboardData) {
            return;
        }

        let jsonClipboardData;

        try {
            jsonClipboardData = JSON.parse(clipboardData);
        } catch {
            return;
        }

        const validatedClipboardData = clipboardRowSchema.safeParse(jsonClipboardData);

        if (!validatedClipboardData.success) {
            return;
        }

        return validatedClipboardData.data;
    };

    const pasteRowFromClipboard = async () => {
        const validatedClipboardData = await getRowFromClipboard();

        if (!validatedClipboardData) {
            snackbarApi.showSnackbar(
                <Snackbar autoHideDuration={5000}>
                    <Alert severity="error">
                        <FormattedMessage id="comet.tableBlock.couldNotPasteClipboardData" defaultMessage="Could not paste the clipboard data" />
                    </Alert>
                </Snackbar>,
            );
            return;
        }

        updateState(insertRowFromClipboardIntoState(state, row.id, validatedClipboardData));
    };

    return (
        <RowActionsMenu>
            <RowActionsMenu>
                <RowActionsItem
                    icon={row.highlighted ? <Remove /> : <Add />}
                    onClick={() => {
                        updateState(toggleHighlightOfRowInState(state, row.id));
                    }}
                >
                    {row.highlighted ? (
                        <FormattedMessage id="comet.tableBlock.removeHighlighting" defaultMessage="Remove highlighting" />
                    ) : (
                        <FormattedMessage id="comet.tableBlock.highlightRow" defaultMessage="Highlight row" />
                    )}
                </RowActionsItem>
                <Divider />
                <RowActionsItem
                    icon={<ArrowUp />}
                    onClick={() => {
                        updateState(insertNewRowIntoState(state, "above", row.id));
                    }}
                >
                    <FormattedMessage id="comet.tableBlock.addRowAbove" defaultMessage="Add row above" />
                </RowActionsItem>
                <RowActionsItem
                    icon={<ArrowDown />}
                    onClick={() => {
                        updateState(insertNewRowIntoState(state, "below", row.id));
                    }}
                >
                    <FormattedMessage id="comet.tableBlock.addRowBelow" defaultMessage="Add row below" />
                </RowActionsItem>
                <Divider />
                <RowActionsItem icon={<Copy />} onClick={copyRowToClipboard}>
                    <FormattedMessage id="comet.tableBlock.copyRow" defaultMessage="Copy" />
                </RowActionsItem>
                <RowActionsItem icon={<Paste />} onClick={pasteRowFromClipboard}>
                    <FormattedMessage id="comet.tableBlock.pasteRow" defaultMessage="Paste" />
                </RowActionsItem>
                <RowActionsItem icon={<Duplicate />} onClick={duplicateRow}>
                    <FormattedMessage id="comet.tableBlock.duplicateRow" defaultMessage="Duplicate" />
                </RowActionsItem>
                <Divider />
                <RowActionsItem
                    icon={<Delete />}
                    onClick={() => {
                        updateState(deleteRowFromState(state, row.id));
                    }}
                >
                    <FormattedMessage id="comet.tableBlock.deleteRow" defaultMessage="Delete" />
                </RowActionsItem>
            </RowActionsMenu>
        </RowActionsMenu>
    );
};
