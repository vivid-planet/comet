import { Alert, RowActionsItem, RowActionsMenu, useSnackbarApi } from "@comet/admin";
import { Add, ArrowDown, ArrowUp, Copy, Delete, Duplicate, Paste, Remove } from "@comet/admin-icons";
import { DispatchSetStateAction } from "@comet/blocks-admin";
import { Divider, Snackbar } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { v4 as uuid } from "uuid";
import { z } from "zod";

import { TableBlockData } from "../../blocks.generated";
import { getNewColumn, getNewRow } from "./utils";

const clipboardRowSchema = z.object({
    highlighted: z.boolean(),
    cellValues: z.array(z.string()),
});

type ClipboardRow = z.infer<typeof clipboardRowSchema>;

type Props = {
    row: Record<string, unknown> & { id: string };
    updateState: DispatchSetStateAction<TableBlockData>;
    state: TableBlockData;
};

export const ActionsCell = ({ row, updateState, state }: Props) => {
    const snackbarApi = useSnackbarApi();

    const insertRow = (where: "above" | "below") => {
        updateState((state) => {
            const currentRowIndex = state.rows.findIndex(({ id }) => id === row.id);
            const newRowIndex = where === "above" ? currentRowIndex : currentRowIndex + 1;

            return {
                ...state,
                rows: [
                    ...state.rows.slice(0, newRowIndex),
                    getNewRow(state.columns.map((column) => ({ columnId: column.id, value: "" }))),
                    ...state.rows.slice(newRowIndex),
                ],
            };
        });
    };

    const deleteRow = () => {
        updateState((state) => {
            return { ...state, rows: state.rows.filter(({ id }) => id !== row.id) };
        });
    };

    const toggleRowHighlight = () => {
        updateState((state) => {
            return {
                ...state,
                rows: state.rows.map((rowInState) => {
                    if (rowInState.id === row.id) {
                        return { ...rowInState, highlighted: !rowInState.highlighted };
                    }
                    return rowInState;
                }),
            };
        });
    };

    const duplicateRow = () => {
        const currentRowIndex = state.rows.findIndex(({ id }) => id === row.id);
        const rowToDuplicate = state.rows[currentRowIndex];

        if (!rowToDuplicate) {
            snackbarApi.showSnackbar(
                <Snackbar autoHideDuration={5000}>
                    <Alert severity="error">
                        <FormattedMessage id="comet.tableBlock.failedToDuplicateRow" defaultMessage="Failed to duplicate row" />
                    </Alert>
                </Snackbar>,
            );
            return;
        }

        updateState((state) => {
            const duplicatedRow = { ...rowToDuplicate, id: uuid() };
            return { ...state, rows: [...state.rows.slice(0, currentRowIndex + 1), duplicatedRow, ...state.rows.slice(currentRowIndex + 1)] };
        });
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

        navigator.clipboard.writeText(JSON.stringify(copyData));
    };

    const showFailedToParseDataSnackbar = () => {
        snackbarApi.showSnackbar(
            <Snackbar autoHideDuration={5000}>
                <Alert severity="error">
                    <FormattedMessage id="comet.tableBlock.couldNotPasteClipboardData" defaultMessage="Could not paste the clipboard data" />
                </Alert>
            </Snackbar>,
        );
    };

    const pasteRowFromClipboard = async () => {
        const clipboardData = await navigator.clipboard.readText();

        let jsonClipboardData;

        try {
            jsonClipboardData = JSON.parse(clipboardData);
        } catch {
            showFailedToParseDataSnackbar();
            return;
        }

        const validatedClipboardData = clipboardRowSchema.safeParse(jsonClipboardData);

        if (!validatedClipboardData.success) {
            showFailedToParseDataSnackbar();
            return;
        }

        updateState((state) => {
            const numberOfColumnsToAdd = validatedClipboardData.data.cellValues.length - state.columns.length;

            const updatedColumns = [...state.columns];
            let updatedRows = [...state.rows];

            Array.from({ length: numberOfColumnsToAdd }).forEach(() => {
                const newColumn = getNewColumn();
                updatedColumns.push(newColumn);
                updatedRows = updatedRows.map((row) => ({
                    ...row,
                    cellValues: [...row.cellValues, { columnId: newColumn.id, value: "" }],
                }));
            });

            const currentRowIndex = updatedRows.findIndex(({ id }) => id === row.id);
            const newRowToPaste: TableBlockData["rows"][number] = {
                id: uuid(),
                highlighted: validatedClipboardData.data.highlighted,
                cellValues: updatedColumns.map(({ id: columnId }, index) => {
                    return {
                        columnId,
                        value: validatedClipboardData.data.cellValues[index] ?? "",
                    };
                }),
            };

            return {
                ...state,
                columns: updatedColumns,
                rows: [...updatedRows.slice(0, currentRowIndex + 1), newRowToPaste, ...updatedRows.slice(currentRowIndex + 1)],
            };
        });
    };

    return (
        <RowActionsMenu>
            <RowActionsMenu>
                <RowActionsItem
                    icon={row.highlighted ? <Remove /> : <Add />}
                    onClick={() => {
                        toggleRowHighlight();
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
                        insertRow("above");
                    }}
                >
                    <FormattedMessage id="comet.tableBlock.addRowAbove" defaultMessage="Add row above" />
                </RowActionsItem>
                <RowActionsItem
                    icon={<ArrowDown />}
                    onClick={() => {
                        insertRow("below");
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
                        deleteRow();
                    }}
                >
                    <FormattedMessage id="comet.tableBlock.deleteRow" defaultMessage="Delete" />
                </RowActionsItem>
            </RowActionsMenu>
        </RowActionsMenu>
    );
};
