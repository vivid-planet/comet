import type { GridColDef } from "@comet/admin";
import { DragIndicator } from "@comet/admin-icons";
import { styled } from "@mui/material/styles";
import {
    DataGrid,
    type GridColumnHeaderParams,
    type GridRenderCellParams,
    type GridRenderEditCellParams,
    type GridValidRowModel,
    useGridApiRef,
} from "@mui/x-data-grid";
import { type ComponentProps, type Dispatch, type DragEvent, type SetStateAction, useEffect } from "react";

import type { TableBlockData } from "../../blocks.generated";
import type { TableBlockState } from "../createTableBlock";
import { CellValue } from "./CellValue";
import { ColumnHeader } from "./ColumnHeader";
import { dataGridStyles } from "./dataGridStyles";
import { EditCell } from "./EditCell";
import { RowActionsCell } from "./RowActionsCell";
import { useTableBlockContext } from "./TableBlockContext";
import { ensureMinimumTableState } from "./utils/ensureMinimumTableState";
import { useRecentlyPastedIds } from "./utils/useRecentlyPastedIds";

type ColumnSize = TableBlockData["columns"][number]["size"];
type TableBlockColumn = TableBlockData["columns"][number];

const REORDER_COLUMN_FIELD = "__reorder__";
const ROW_REORDER_DATA_TRANSFER_TYPE = "application/x-comet-table-block-row-id";

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
    state: TableBlockState;
    updateState: Dispatch<SetStateAction<TableBlockState>>;
};

export const TableBlockGrid = ({ state, updateState }: Props) => {
    const { RichTextBlock } = useTableBlockContext();
    const apiRef = useGridApiRef();
    const { recentlyPastedIds: recentlyPastedRowIds, addToRecentlyPastedIds: addToRecentlyPastedRowIds } = useRecentlyPastedIds();
    const { recentlyPastedIds: recentlyPastedColumnIds, addToRecentlyPastedIds: addToRecentlyPastedColumnIds } = useRecentlyPastedIds();

    useEffect(() => {
        if (state.columns.length === 0 || state.rows.length === 0) {
            updateState((prevState) => ensureMinimumTableState(prevState, RichTextBlock));
        }
    }, [state.columns.length, state.rows.length, updateState, RichTextBlock]);

    const setRowData: Dispatch<SetStateAction<TableBlockState["rows"]>> = (newRows) => {
        updateState((state) => {
            return { ...state, rows: typeof newRows === "function" ? newRows(state.rows) : newRows };
        });
    };

    const processRowUpdate: ComponentProps<typeof DataGrid>["processRowUpdate"] = (newRow) => {
        const { id: newRowId, ...newRowValuesRecord } = newRow;

        setRowData((previousRowData) => {
            return previousRowData.map((existingRow) => {
                if (existingRow.id === newRowId) {
                    return {
                        ...existingRow,
                        cellValues: Object.entries(newRowValuesRecord).map(([columnId, value]) => ({
                            columnId,
                            value,
                        })),
                    };
                }
                return existingRow;
            });
        });

        return newRow;
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

    const dataGridColumns: GridColDef[] = [
        {
            field: REORDER_COLUMN_FIELD,
            sortable: false,
            filterable: false,
            minWidth: 36,
            maxWidth: 36,
            align: "center",
            headerAlign: "center",
            disableColumnMenu: true,
            resizable: false,
            renderHeader: () => null,
            renderCell: ({ row }: GridRenderCellParams) => {
                const rowIndex = state.rows.findIndex((rowInState) => rowInState.id === row.id);
                return <RowReorderCell rowId={row.id} rowIndex={rowIndex} onMoveRow={moveRow} />;
            },
        },
        ...state.columns.map(({ id: columnId, highlighted, size }: TableBlockColumn, index: number) => ({
            field: columnId,
            editable: true,
            sortable: false,
            flex: flexForColumnSize[size],
            minWidth: widthForColumnSize[size],
            renderHeader: (params: GridColumnHeaderParams) => (
                <ColumnHeader
                    {...params}
                    state={state}
                    columnSize={size}
                    highlighted={highlighted}
                    updateState={updateState}
                    columnIndex={index}
                    addToRecentlyPastedIds={addToRecentlyPastedColumnIds}
                />
            ),
            renderCell: ({ value, row, field: columnId }: GridRenderCellParams) => {
                const rowFromState = state.rows.find((rowInState) => rowInState.id === row.id);
                const rowWasRecentlyPasted = recentlyPastedRowIds.includes(row.id);
                const columnWasRecentlyPasted = recentlyPastedColumnIds.includes(columnId);

                return (
                    <CellValue
                        value={value}
                        highlighted={rowFromState?.highlighted || highlighted}
                        recentlyPasted={rowWasRecentlyPasted || columnWasRecentlyPasted}
                    />
                );
            },
            renderEditCell: (params: GridRenderEditCellParams) => {
                return <EditCell {...params} />;
            },
        })),
        {
            field: "actions",
            sortable: false,
            headerName: "",
            minWidth: 36,
            maxWidth: 36,
            disableReorder: true,
            renderCell: ({ row }) => (
                <RowActionsCell row={row} updateState={updateState} state={state} addToRecentlyPastedIds={addToRecentlyPastedRowIds} />
            ),
        },
    ];

    const rowsInDataGridFormat = state.rows.map(({ id, cellValues }) => {
        const dataGridRow: GridValidRowModel = { id };
        cellValues.forEach(({ columnId, value }) => {
            dataGridRow[columnId] = value;
        });
        return dataGridRow;
    });

    return (
        <DataGrid
            columns={dataGridColumns}
            apiRef={apiRef}
            rows={rowsInDataGridFormat}
            rowHeight={55}
            disableColumnResize
            disableColumnMenu
            disableRowSelectionOnClick
            hideFooter
            sx={dataGridStyles}
            processRowUpdate={processRowUpdate}
        />
    );
};

type RowReorderCellProps = {
    rowId: string;
    rowIndex: number;
    onMoveRow: (targetIndex: number, rowId: string) => void;
};

const RowReorderCell = ({ rowId, rowIndex, onMoveRow }: RowReorderCellProps) => {
    const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData(ROW_REORDER_DATA_TRANSFER_TYPE, rowId);
        event.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        if (event.dataTransfer.types.includes(ROW_REORDER_DATA_TRANSFER_TYPE)) {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
        }
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        const draggedRowId = event.dataTransfer.getData(ROW_REORDER_DATA_TRANSFER_TYPE);
        if (!draggedRowId || draggedRowId === rowId) {
            return;
        }
        event.preventDefault();
        onMoveRow(rowIndex, draggedRowId);
    };

    return (
        <RowReorderHandle draggable onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop}>
            <DragIndicator />
        </RowReorderHandle>
    );
};

const RowReorderHandle = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    cursor: "grab",
    color: theme.palette.text.secondary,

    "&:active": {
        cursor: "grabbing",
    },
}));
