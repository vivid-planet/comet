import { Alert, RowActionsItem, RowActionsMenu, useSnackbarApi, writeClipboardText } from "@comet/admin";
import { Add, ArrowDown, ArrowUp, Copy, Delete, Duplicate, Paste, Remove } from "@comet/admin-icons";
import { Divider, Snackbar } from "@mui/material";
import { type Dispatch, type SetStateAction } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { v4 as uuid } from "uuid";

import { type TableBlockData } from "../../blocks.generated";
import { getClipboardValueForSchema } from "./utils/getClipboardValueForSchema";
import { getInsertDataFromRowById, insertRowDataAtIndex, type RowInsertData, rowInsertSchema } from "./utils/row";

type Props = {
    row: Record<string, unknown> & { id: string };
    updateState: Dispatch<SetStateAction<TableBlockData>>;
    state: TableBlockData;
    addToRecentlyPastedIds: (id: string) => void;
};

export const RowActionsCell = ({ row, updateState, state, addToRecentlyPastedIds }: Props) => {
    const snackbarApi = useSnackbarApi();
    const stateRow = state.rows.find((rowInState) => rowInState.id === row.id);
    const intl = useIntl();

    const handleInsertNewRow = (where: "above" | "below") => {
        updateState((state) => {
            const currentRowIndex = state.rows.findIndex(({ id }) => id === row.id);
            const newRowIndex = where === "above" ? currentRowIndex : currentRowIndex + 1;

            const insertData: RowInsertData = {
                highlighted: false,
                cellValues: state.columns.map(() => ""),
            };
            return insertRowDataAtIndex(state, insertData, newRowIndex);
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

    const handleDuplicateRow = () => {
        const duplicatedRowInsertData = getInsertDataFromRowById(state, row.id);
        const currentRowIndex = state.rows.findIndex(({ id }) => id === row.id);

        if (!duplicatedRowInsertData) {
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
            const newRowId = uuid();
            addToRecentlyPastedIds(newRowId);
            return insertRowDataAtIndex(state, duplicatedRowInsertData, currentRowIndex + 1, newRowId);
        });
    };

    const handleCopyRowToClipboard = () => {
        const rowInsertData = getInsertDataFromRowById(state, row.id);
        if (!rowInsertData) {
            snackbarApi.showSnackbar(
                <Snackbar autoHideDuration={5000}>
                    <Alert severity="error">
                        <FormattedMessage id="comet.tableBlock.failedToCopyRow" defaultMessage="Failed to copy row" />
                    </Alert>
                </Snackbar>,
            );
            return;
        }

        writeClipboardText(JSON.stringify(rowInsertData));
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
        const clipboardData = await getClipboardValueForSchema(rowInsertSchema);

        if (!clipboardData) {
            showFailedToParseDataSnackbar();
            return;
        }

        updateState((state) => {
            const newRowId = uuid();
            addToRecentlyPastedIds(newRowId);
            const currentRowIndex = state.rows.findIndex(({ id }) => id === row.id);
            return insertRowDataAtIndex(state, clipboardData, currentRowIndex + 1, newRowId);
        });
    };

    return (
        <RowActionsMenu>
            <RowActionsMenu
                componentsProps={{
                    rowActionsIconItem: {
                        componentsProps: {
                            iconButton: {
                                "aria-label": intl.formatMessage({ id: "comet.tableBlock.openRowOptions", defaultMessage: "Open row options" }),
                            },
                        },
                    },
                }}
            >
                <RowActionsItem
                    icon={stateRow?.highlighted ? <Remove /> : <Add />}
                    onClick={() => {
                        toggleRowHighlight();
                    }}
                >
                    {stateRow?.highlighted ? (
                        <FormattedMessage id="comet.tableBlock.removeHighlighting" defaultMessage="Remove highlighting" />
                    ) : (
                        <FormattedMessage id="comet.tableBlock.highlightRow" defaultMessage="Highlight row" />
                    )}
                </RowActionsItem>
                <Divider />
                <RowActionsItem
                    icon={<ArrowUp />}
                    onClick={() => {
                        handleInsertNewRow("above");
                    }}
                >
                    <FormattedMessage id="comet.tableBlock.addRowAbove" defaultMessage="Add row above" />
                </RowActionsItem>
                <RowActionsItem
                    icon={<ArrowDown />}
                    onClick={() => {
                        handleInsertNewRow("below");
                    }}
                >
                    <FormattedMessage id="comet.tableBlock.addRowBelow" defaultMessage="Add row below" />
                </RowActionsItem>
                <Divider />
                <RowActionsItem icon={<Copy />} onClick={handleCopyRowToClipboard}>
                    <FormattedMessage id="comet.tableBlock.copyRow" defaultMessage="Copy" />
                </RowActionsItem>
                <RowActionsItem icon={<Paste />} onClick={pasteRowFromClipboard}>
                    <FormattedMessage id="comet.tableBlock.pasteRow" defaultMessage="Paste" />
                </RowActionsItem>
                <RowActionsItem icon={<Duplicate />} onClick={handleDuplicateRow}>
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
