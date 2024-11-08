import { GridColDef, RowActionsItem, RowActionsMenu } from "@comet/admin";
import { Add, ArrowDown, ArrowUp, Copy, Delete, DragIndicator, Duplicate, Paste, Remove } from "@comet/admin-icons";
import { DispatchSetStateAction } from "@comet/blocks-admin";
import { Divider } from "@mui/material";
import {
    DataGridPro,
    GRID_REORDER_COL_DEF,
    GridEventListener,
    GridRenderCellParams,
    GridRenderEditCellParams,
    useGridApiRef,
} from "@mui/x-data-grid-pro";
import { FormattedMessage } from "react-intl";
import { v4 as uuid } from "uuid";

import { TableBlockData } from "../../blocks.generated";
import { CellValue } from "./CellValue";
import { ColumnHeader } from "./ColumnHeader";
import { dataGridStyles } from "./dataGridStyles";
import { EditCell } from "./EditCell";

export type ColumnSize = "extraSmall" | "small" | "standard" | "large" | "extraLarge";

const widthForColumnSize: Record<ColumnSize, number> = {
    extraSmall: 100,
    small: 200,
    standard: 300,
    large: 400,
    extraLarge: 500,
};

const flexForColumnSize: Record<ColumnSize, number> = {
    extraSmall: 1,
    small: 2,
    standard: 3,
    large: 4,
    extraLarge: 5,
};

export const getNewColumn = (position: number): TableBlockData["columns"][number] => {
    return { id: uuid(), position, highlighted: false, size: "standard" };
};

type Props = {
    state: TableBlockData;
    updateState: DispatchSetStateAction<TableBlockData>;
};

export const TableBlockGrid = ({ state, updateState }: Props) => {
    const apiRef = useGridApiRef();

    const setRowData: DispatchSetStateAction<TableBlockData["rows"]> = (newRows) => {
        updateState((state) => {
            return { ...state, rows: typeof newRows === "function" ? newRows(state.rows) : newRows };
        });
    };

    const handleCellEditCommit: GridEventListener<"cellEditCommit"> = ({ value: newValue, field: columnId, id: rowId }) => {
        setRowData((previousRowData) => {
            return previousRowData.map((row) => {
                if (row.id === rowId) {
                    return {
                        ...row,
                        columnValues: row.columnValues.map((columnValue) => {
                            if (columnValue.columnId === columnId) {
                                return { ...columnValue, value: newValue };
                            }
                            return columnValue;
                        }),
                    };
                }
                return row;
            });
        });
    };

    const dataGridColumns: GridColDef<Pick<TableBlockData["rows"][number], "id" | "position" | "highlighted">>[] = [
        {
            ...GRID_REORDER_COL_DEF,
            minWidth: 36,
            maxWidth: 36,
        },
        ...state.columns.map(({ id: columnId, highlighted, size }) => ({
            field: columnId,
            editable: true,
            sortable: false,
            type: "string",
            flex: flexForColumnSize[size],
            minWidth: widthForColumnSize[size],
            // @ts-expect-error TODO: Fix the type of `params`
            renderHeader: (params) => <ColumnHeader {...params} columnSize={size} highlighted={highlighted} />,
            renderCell: ({ value, row }: GridRenderCellParams) => <CellValue value={value} highlighted={row.highlighted || highlighted} />,
            renderEditCell: (params: GridRenderEditCellParams) => <EditCell {...params} />,
        })),
        {
            field: "actions",
            sortable: false,
            headerName: "",
            minWidth: 36,
            maxWidth: 36,
            disableReorder: true,
            renderCell: ({ row }) => {
                return (
                    <RowActionsMenu>
                        <RowActionsMenu>
                            <RowActionsItem
                                icon={row.highlighted ? <Remove /> : <Add />}
                                disabled
                                onClick={() => {
                                    // TODO: Implement this
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
                                disabled
                                onClick={() => {
                                    // TODO: Implement this
                                }}
                            >
                                <FormattedMessage id="comet.tableBlock.addRowAbove" defaultMessage="Add row above" />
                            </RowActionsItem>
                            <RowActionsItem
                                icon={<ArrowDown />}
                                disabled
                                onClick={() => {
                                    // TODO: Implement this
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
                            <RowActionsItem
                                icon={<Duplicate />}
                                disabled
                                onClick={() => {
                                    // TODO: Implement this
                                }}
                            >
                                <FormattedMessage id="comet.tableBlock.duplicateRow" defaultMessage="Duplicate" />
                            </RowActionsItem>
                            <Divider />
                            <RowActionsItem icon={<Delete />}>
                                <FormattedMessage id="comet.tableBlock.deleteRow" defaultMessage="Delete" />
                            </RowActionsItem>
                        </RowActionsMenu>
                    </RowActionsMenu>
                );
            },
        },
    ];

    // TODO: Can this be simplified?
    const gridRows = state.rows.map((row) => {
        const newRow: Record<string, string> = {
            id: row.id,
        };
        row.columnValues.forEach((columnValue) => {
            newRow[columnValue.columnId] = columnValue.value;
        });
        return newRow;
    });

    return (
        <DataGridPro
            columns={dataGridColumns}
            apiRef={apiRef}
            // @ts-expect-error TODO: Make `id` always included in the type of the individual rows
            rows={gridRows}
            rowHeight={55}
            rowReordering
            disableColumnResize
            disableColumnMenu
            disableSelectionOnClick
            hideFooter
            pinnedColumns={{
                left: ["__reorder__"],
                right: ["actions"],
            }}
            components={{
                RowReorderIcon: DragIndicator,
            }}
            sx={dataGridStyles}
            onRowOrderChange={() => {
                // TODO: Implement this
            }}
            onColumnOrderChange={() => {
                // TODO: Implement this
            }}
            onCellEditCommit={handleCellEditCommit}
        />
    );
};
