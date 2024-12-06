import { DragIndicator } from "@comet/admin-icons";
import { DispatchSetStateAction } from "@comet/blocks-admin";
import { GridColDef, GridColumnHeaderParams } from "@mui/x-data-grid";
import {
    DataGridPro,
    GRID_REORDER_COL_DEF,
    GridEventListener,
    GridRenderCellParams,
    GridRenderEditCellParams,
    useGridApiRef,
} from "@mui/x-data-grid-pro";
import { useEffect } from "react";

import { TableBlockData } from "../../blocks.generated";
import { ActionsCell } from "./ActionsCell";
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
                        cellValues: row.cellValues.map((cellValue) => {
                            if (cellValue.columnId === columnId) {
                                return { ...cellValue, value: newValue };
                            }
                            return cellValue;
                        }),
                    };
                }
                return row;
            });
        });
    };

    const moveRow = (targetIndex: number, rowId: string) => {
        updateState((state) => {
            const movingRow = state.rows.find((row) => row.id === rowId);
            if (!movingRow) {
                return state;
            }

            const otherRows = state.rows.filter((row) => row.id !== rowId);
            return {
                ...state,
                rows: [...otherRows.slice(0, targetIndex), movingRow, ...otherRows.slice(targetIndex)],
            };
        });
    };

    useEffect(() => {
        const handleMoveColumn: GridEventListener<"columnHeaderDragEnd"> = ({ field: columnId }) => {
            const targetIndex = apiRef.current.getColumnIndex(columnId) - 1;

            updateState((state) => {
                const movingColumn = state.columns.find((column) => column.id === columnId);
                if (!movingColumn) {
                    return state;
                }

                const otherColumns = state.columns.filter((column) => column.id !== columnId);
                return {
                    ...state,
                    columns: [...otherColumns.slice(0, targetIndex), movingColumn, ...otherColumns.slice(targetIndex)],
                };
            });
        };

        return apiRef.current.subscribeEvent("columnHeaderDragEnd", handleMoveColumn);
    }, [apiRef, updateState]);

    const dataGridColumns: GridColDef[] = [
        {
            ...GRID_REORDER_COL_DEF,
            minWidth: 36,
            maxWidth: 36,
        },
        ...state.columns.map(({ id: columnId, highlighted, size }, index) => ({
            field: columnId,
            editable: true,
            sortable: false,
            type: "string",
            flex: flexForColumnSize[size],
            minWidth: widthForColumnSize[size],
            renderHeader: (params: GridColumnHeaderParams) => (
                <ColumnHeader {...params} columnSize={size} highlighted={highlighted} updateState={updateState} state={state} columnIndex={index} />
            ),
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
            renderCell: ({ row }) => <ActionsCell row={row} updateState={updateState} state={state} />,
        },
    ];

    // TODO: Can this be simplified?
    const gridRows = state.rows.map((row) => {
        const newRow: Record<string, string> = {
            id: row.id,
        };
        row.cellValues.forEach((cellValue) => {
            newRow[cellValue.columnId] = cellValue.value;
        });
        return newRow;
    });

    return (
        <DataGridPro
            columns={dataGridColumns}
            apiRef={apiRef}
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
            onRowOrderChange={({ targetIndex, row }) => {
                moveRow(targetIndex, row.id);
            }}
            onCellEditCommit={handleCellEditCommit}
        />
    );
};
