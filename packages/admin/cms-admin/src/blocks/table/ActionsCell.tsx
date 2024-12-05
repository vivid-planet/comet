import { Alert, RowActionsItem, RowActionsMenu, useSnackbarApi } from "@comet/admin";
import { Add, ArrowDown, ArrowUp, Copy, Delete, Duplicate, Paste, Remove } from "@comet/admin-icons";
import { DispatchSetStateAction } from "@comet/blocks-admin";
import { Divider, Snackbar } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { v4 as uuid } from "uuid";

import { TableBlockData } from "../../blocks.generated";
import { getNewRow } from "./utils";

type Props = {
    row: Record<string, unknown> & { id: string };
    updateState: DispatchSetStateAction<TableBlockData>;
};

export const ActionsCell = ({ row, updateState }: Props) => {
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
        updateState((state) => {
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

                return state;
            }

            const duplicatedRow = { ...rowToDuplicate, id: uuid() };
            return { ...state, rows: [...state.rows.slice(0, currentRowIndex + 1), duplicatedRow, ...state.rows.slice(currentRowIndex + 1)] };
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
                <RowActionsItem
                    icon={<Copy />}
                    disabled
                    onClick={() => {
                        // TODO: Implement this
                    }}
                >
                    <FormattedMessage id="comet.tableBlock.copyRow" defaultMessage="Copy" />
                </RowActionsItem>
                <RowActionsItem
                    icon={<Paste />}
                    disabled
                    onClick={() => {
                        // TODO: Implement this
                    }}
                >
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
