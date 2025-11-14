import { Alert, RowActionsItem, RowActionsMenu, useSnackbarApi } from "@comet/admin";
import { Add, Copy, Delete, DensityStandard, DragIndicator, Duplicate, Paste, PinLeft, PinRight, Remove } from "@comet/admin-icons";
import { ButtonBase, Divider, Snackbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { type GridColumnHeaderParams } from "@mui/x-data-grid";
import { type Dispatch, type ReactNode, type SetStateAction } from "react";
import { FormattedMessage } from "react-intl";
import { v4 as uuid } from "uuid";

import { type TableBlockData } from "../../blocks.generated";
import { type ColumnSize } from "./TableBlockGrid";
import { getNewColumn } from "./utils";

type Props = GridColumnHeaderParams & {
    columnSize: ColumnSize;
    highlighted: boolean;
    updateState: Dispatch<SetStateAction<TableBlockData>>;
    columnIndex: number;
    addToRecentlyPastedIds: (id: string) => void;
};

const columnSizes: Record<ColumnSize, ReactNode> = {
    extraSmall: <FormattedMessage id="comet.tableBlock.columnSize.extraSmall" defaultMessage="Extra small" />,
    small: <FormattedMessage id="comet.tableBlock.columnSize.small" defaultMessage="Small" />,
    standard: <FormattedMessage id="comet.tableBlock.columnSize.standard" defaultMessage="Standard" />,
    large: <FormattedMessage id="comet.tableBlock.columnSize.large" defaultMessage="Large" />,
    extraLarge: <FormattedMessage id="comet.tableBlock.columnSize.extraLarge" defaultMessage="Extra large" />,
};

export const ColumnHeader = ({ columnSize, highlighted, updateState, columnIndex, field: columnId, addToRecentlyPastedIds }: Props) => {
    const snackbarApi = useSnackbarApi();

    const insertColumn = (newColumnIndex: number) => {
        const newColumn = getNewColumn();
        updateState((state) => {
            return {
                ...state,
                columns: [...state.columns.slice(0, newColumnIndex), newColumn, ...state.columns.slice(newColumnIndex)],
                rows: state.rows.map((row) => ({
                    ...row,
                    cellValues: [...row.cellValues, { columnId: newColumn.id, value: "" }],
                })),
            };
        });
    };

    const deleteColumn = () => {
        updateState((state) => {
            return {
                ...state,
                columns: state.columns.filter((column) => column.id !== columnId),
                rows: state.rows.map((row) => ({
                    ...row,
                    cellValues: row.cellValues.filter((cellValue) => cellValue.columnId !== columnId),
                })),
            };
        });
    };

    const toggleColumnHighlight = () => {
        updateState((state) => {
            return {
                ...state,
                columns: state.columns.map((column) => {
                    if (column.id === columnId) {
                        return { ...column, highlighted: !highlighted };
                    }
                    return column;
                }),
            };
        });
    };

    const setColumnSize = (size: ColumnSize) => {
        updateState((state) => {
            return { ...state, columns: state.columns.map((column) => (column.id === columnId ? { ...column, size } : column)) };
        });
    };

    const duplicateColumn = () => {
        updateState((state) => {
            const currentColumnIndex = state.columns.findIndex(({ id }) => id === columnId);
            const columnToDuplicate = state.columns[currentColumnIndex];

            if (!columnToDuplicate) {
                snackbarApi.showSnackbar(
                    <Snackbar autoHideDuration={5000}>
                        <Alert severity="error">
                            <FormattedMessage id="comet.tableBlock.failedToDuplicateColumn" defaultMessage="Failed to duplicate column" />
                        </Alert>
                    </Snackbar>,
                );
                return state;
            }
            const duplicatedColumn = { ...columnToDuplicate, id: uuid() };
            addToRecentlyPastedIds(duplicatedColumn.id);

            return {
                ...state,
                columns: [...state.columns.slice(0, currentColumnIndex + 1), duplicatedColumn, ...state.columns.slice(currentColumnIndex + 1)],
                rows: state.rows.map((row) => {
                    const cellValueOfDuplicatedColumn = row.cellValues.find(({ columnId: cellValueColumnId }) => cellValueColumnId === columnId);
                    const newCellValues = [...row.cellValues];
                    newCellValues.push({ columnId: duplicatedColumn.id, value: cellValueOfDuplicatedColumn?.value ?? "" });

                    return {
                        ...row,
                        cellValues: newCellValues,
                    };
                }),
            };
        });
    };

    return (
        <>
            <ColumnHeaderButton component="div" disableRipple>
                <DragIndicator />
            </ColumnHeaderButton>
            <RowActionsMenu>
                <RowActionsMenu>
                    <RowActionsMenu text="Column width" icon={<DensityStandard />}>
                        {Object.entries(columnSizes).map(([size, label]) => (
                            <RowActionsItem
                                key={size}
                                onClick={() => {
                                    setColumnSize(size as ColumnSize);
                                }}
                                componentsProps={{ menuItem: { selected: columnSize === size } }}
                            >
                                {label}
                            </RowActionsItem>
                        ))}
                    </RowActionsMenu>
                    <RowActionsItem
                        icon={highlighted ? <Remove /> : <Add />}
                        onClick={() => {
                            toggleColumnHighlight();
                        }}
                    >
                        {highlighted ? "Remove highlighting" : "Highlight column"}
                    </RowActionsItem>
                    <Divider />
                    <RowActionsItem
                        icon={<PinLeft />}
                        onClick={() => {
                            insertColumn(columnIndex);
                        }}
                    >
                        <FormattedMessage id="comet.tableBlock.insertColumnLeft" defaultMessage="Insert column left" />
                    </RowActionsItem>
                    <RowActionsItem
                        icon={<PinRight />}
                        onClick={() => {
                            insertColumn(columnIndex + 1);
                        }}
                    >
                        <FormattedMessage id="comet.tableBlock.insertColumnRight" defaultMessage="Insert column right" />
                    </RowActionsItem>
                    <Divider />
                    <RowActionsItem
                        icon={<Copy />}
                        disabled
                        onClick={() => {
                            // TODO: Implement this
                        }}
                    >
                        <FormattedMessage id="comet.tableBlock.copyColumn" defaultMessage="Copy" />
                    </RowActionsItem>
                    <RowActionsItem
                        icon={<Paste />}
                        disabled
                        onClick={() => {
                            // TODO: Implement this
                            // TODO: Add to recently pasted ids
                        }}
                    >
                        <FormattedMessage id="comet.tableBlock.pasteColumn" defaultMessage="Paste" />
                    </RowActionsItem>
                    <RowActionsItem icon={<Duplicate />} onClick={duplicateColumn}>
                        <FormattedMessage id="comet.tableBlock.duplicateColumn" defaultMessage="Duplicate" />
                    </RowActionsItem>
                    <Divider />
                    <RowActionsItem
                        icon={<Delete />}
                        onClick={() => {
                            deleteColumn();
                        }}
                    >
                        <FormattedMessage id="comet.tableBlock.deleteColumn" defaultMessage="Delete" />
                    </RowActionsItem>
                </RowActionsMenu>
            </RowActionsMenu>
        </>
    );
};

// TODO: Explain this comment better??
// Workaround: When a button is rendered inside the ColumnHeader (e.g. RowActionsItem), only buttons can be used for column reordering
const ColumnHeaderButton = styled(ButtonBase)(({ theme }) => ({
    position: "absolute",
    inset: 0,
    cursor: "move",
    justifyContent: "flex-start",
    paddingLeft: theme.spacing(2),
})) as typeof ButtonBase;
