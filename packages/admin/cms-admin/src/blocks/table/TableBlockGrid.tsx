import { DragIndicator } from "@comet/admin-icons";
// eslint-disable-next-line no-restricted-imports
import { type GridColDef, type GridColumnHeaderParams, type GridValidRowModel } from "@mui/x-data-grid";
import {
    DataGridPro,
    GRID_REORDER_COL_DEF,
    type GridEventListener,
    type GridRenderCellParams,
    type GridRenderEditCellParams,
    useGridApiRef,
} from "@mui/x-data-grid-pro";
import { type ComponentProps, type Dispatch, type SetStateAction, useEffect } from "react";

import { type RichTextBlockState } from "../createRichTextBlock";
import { CellValue } from "./CellValue";
import { ColumnHeader } from "./ColumnHeader";
import { type ColumnSize, type RichTextBlock, type TableBlockColumn, type TableBlockState } from "../factories/createTableBlock";
import { dataGridStyles } from "./dataGridStyles";
import { EditCell } from "./EditCell";
import { RowActionsCell } from "./RowActionsCell";
import { useRecentlyPastedIds } from "./utils/useRecentlyPastedIds";

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
    RichTextBlock: RichTextBlock;
};

export const TableBlockGrid = ({ state, updateState, RichTextBlock }: Props) => {
    const apiRef = useGridApiRef();
    const { recentlyPastedIds: recentlyPastedRowIds, addToRecentlyPastedIds: addToRecentlyPastedRowIds } = useRecentlyPastedIds();
    const { recentlyPastedIds: recentlyPastedColumnIds, addToRecentlyPastedIds: addToRecentlyPastedColumnIds } = useRecentlyPastedIds();

    useEffect(() => {
        if (state.columns.length === 0 || state.rows.length === 0) {
            updateState((prevState) => {
                let result = prevState;

                if (result.columns.length === 0) {
                    const newColumnId = crypto.randomUUID();
                    result = {
                        ...result,
                        columns: [{ id: newColumnId, size: "standard", highlighted: false }],
                        rows: result.rows.map((row) => ({
                            ...row,
                            cellValues: [...row.cellValues, { columnId: newColumnId, value: RichTextBlock.defaultValues() }],
                        })),
                    };
                }

                if (result.rows.length === 0) {
                    result = {
                        ...result,
                        rows: [
                            {
                                id: crypto.randomUUID(),
                                highlighted: false,
                                cellValues: result.columns.map((col: TableBlockColumn) => ({
                                    columnId: col.id,
                                    value: RichTextBlock.defaultValues(),
                                })),
                            },
                        ],
                    };
                }

                return result;
            });
        }
    }, [state.columns.length, state.rows.length, updateState, RichTextBlock]);

    const setRowData: Dispatch<SetStateAction<TableBlockState["rows"]>> = (newRows) => {
        updateState((state) => {
            return { ...state, rows: typeof newRows === "function" ? newRows(state.rows) : newRows };
        });
    };

    const processRowUpdate: ComponentProps<typeof DataGridPro>["processRowUpdate"] = (newRow) => {
        const { id: newRowId, ...newRowValuesRecord } = newRow;

        setRowData((previousRowData) => {
            return previousRowData.map((existingRow) => {
                if (existingRow.id === newRowId) {
                    return {
                        ...existingRow,
                        cellValues: Object.entries(newRowValuesRecord).map(([columnId, value]) => ({
                            columnId,
                            value: value as RichTextBlockState,
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

    useEffect(() => {
        const handleMoveColumn: GridEventListener<"columnHeaderDragEnd"> = ({ field: columnId }) => {
            const targetIndex = apiRef.current.getColumnIndex(columnId) - 1;

            updateState((state) => {
                const movingColumn = state.columns.find((column: TableBlockColumn) => column.id === columnId);
                if (!movingColumn) {
                    return state;
                }

                const otherColumns = state.columns.filter((column: TableBlockColumn) => column.id !== columnId);
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
                    RichTextBlock={RichTextBlock}
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
                return <EditCell {...params} RichTextBlock={RichTextBlock} />;
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
                <RowActionsCell
                    row={row}
                    updateState={updateState}
                    state={state}
                    addToRecentlyPastedIds={addToRecentlyPastedRowIds}
                    RichTextBlock={RichTextBlock}
                />
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
        <DataGridPro
            columns={dataGridColumns}
            apiRef={apiRef}
            rows={rowsInDataGridFormat}
            rowHeight={55}
            rowReordering
            disableColumnResize
            disableColumnMenu
            disableRowSelectionOnClick
            hideFooter
            pinnedColumns={{
                left: ["__reorder__"],
                right: ["actions"],
            }}
            slots={{
                rowReorderIcon: DragIndicator,
            }}
            sx={dataGridStyles}
            onRowOrderChange={({ targetIndex, row }) => {
                moveRow(targetIndex, row.id);
            }}
            processRowUpdate={processRowUpdate}
        />
    );
};
