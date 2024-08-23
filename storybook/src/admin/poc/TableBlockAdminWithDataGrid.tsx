import { GridColDef, RowActionsItem, RowActionsMenu, SaveButton, useStoredState } from "@comet/admin";
import { Add, ArrowDown, ArrowUp, Copy, Delete, DragIndicator, Duplicate, Paste, Remove } from "@comet/admin-icons";
import { Dialog, DialogActions, DialogTitle, Divider } from "@mui/material";
import {
    DataGridPro,
    GRID_REORDER_COL_DEF,
    GridColumnHeaderParams,
    GridRenderCellParams,
    GridRenderEditCellParams,
    useGridApiRef,
} from "@mui/x-data-grid-pro";
import { storiesOf } from "@storybook/react";
import React from "react";
import { v4 as uuid } from "uuid";

import { CellValue } from "./CellValue";
import { ColumnHeader } from "./ColumnHeader";
import { dataGridStyles } from "./dataGridStyles";
import { EditCell } from "./EditCell";
import { getColumnUtils } from "./getColumnUtils";
import { getInitialTableData } from "./getInitialTableData";
import { getRowUtils } from "./getRowUtils";

export type ColumnSize = "extraSmall" | "small" | "standard" | "large" | "extraLarge";

type ColumnSettingsData = {
    columnId: string;
    columnPosition: number;
    columnSize: ColumnSize;
    highlighted: boolean;
    setColumnData: React.Dispatch<React.SetStateAction<ColumnDataItem[]>>;
    setRowData: React.Dispatch<React.SetStateAction<RowData[]>>;
};

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

export type ColumnDataItem = {
    id: string;
    position: number;
    size: ColumnSize;
    highlighted: boolean;
};

export type RowData = {
    id: string;
    position: number;
    highlighted: boolean;
    columnValues: Record<ColumnDataItem["id"], string>;
};

export const getNewColumn = (position: number): ColumnDataItem => ({ id: uuid(), position, highlighted: false, size: "standard" });

const Story = () => {
    const apiRef = useGridApiRef();

    const { rows: initialRowData, columns: initialColumnData } = getInitialTableData();
    const [rowData, setRowData] = useStoredState<RowData[]>("debug-row-data", initialRowData);
    const [columnData, setColumnData] = useStoredState<ColumnDataItem[]>("debug-column-data", initialColumnData);

    const {
        handleCellEditCommit,
        deleteRow,
        toggleRowHighlighted,
        addRow,
        copyRowToClipboard,
        pasteaRowFromClipboard,
        duplicateRow,
        handleRowOrderChange,
    } = getRowUtils({ columnData, rowData, setRowData });
    const { handleColumnOrderChange } = getColumnUtils({ columnData, setColumnData, rowData, setRowData });

    const columns: GridColDef<Pick<RowData, "id" | "position" | "highlighted">>[] = [
        {
            ...GRID_REORDER_COL_DEF,
            minWidth: 36,
            maxWidth: 36,
        },
        ...columnData.map(({ id: columnId, position, highlighted, size }) => ({
            field: columnId,
            editable: true,
            sortable: false,
            type: "string",
            flex: flexForColumnSize[size],
            minWidth: widthForColumnSize[size],
            renderHeader: (params: GridColumnHeaderParams) => (
                <ColumnHeader
                    {...params}
                    columnId={columnId}
                    columnPosition={position}
                    columnSize={size}
                    highlighted={highlighted}
                    columnData={columnData}
                    setColumnData={setColumnData}
                    rowData={rowData}
                    setRowData={setRowData}
                />
            ),
            renderCell: ({ value, row }: GridRenderCellParams) => {
                return <CellValue value={value} highlighted={row.highlighted || highlighted} />;
            },
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
                            <RowActionsItem icon={row.highlighted ? <Remove /> : <Add />} onClick={() => toggleRowHighlighted(row.id)}>
                                {row.highlighted ? "Remove highlighting" : "Highlight row"}
                            </RowActionsItem>
                            <Divider />
                            <RowActionsItem icon={<ArrowUp />} onClick={() => addRow(row.position - 1)}>
                                Add row above
                            </RowActionsItem>
                            <RowActionsItem icon={<ArrowDown />} onClick={() => addRow(row.position)}>
                                Add row below
                            </RowActionsItem>
                            <Divider />
                            <RowActionsItem onClick={() => copyRowToClipboard(row.id)} icon={<Copy />}>
                                Copy
                            </RowActionsItem>
                            <RowActionsItem onClick={() => pasteaRowFromClipboard(row.position)} icon={<Paste />}>
                                Paste
                            </RowActionsItem>
                            <RowActionsItem onClick={() => duplicateRow(row.id)} icon={<Duplicate />}>
                                Duplicate
                            </RowActionsItem>
                            <Divider />
                            <RowActionsItem icon={<Delete />} onClick={() => deleteRow(row.id, row.position)}>
                                Delete
                            </RowActionsItem>
                        </RowActionsMenu>
                    </RowActionsMenu>
                );
            },
        },
    ];

    return (
        <Dialog open maxWidth="xl">
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>POC: TableBlock admin using DataGrid</DialogTitle>
            <DataGridPro
                columns={columns}
                apiRef={apiRef}
                rows={rowData.map(({ columnValues, ...rowData }) => ({
                    ...rowData,
                    ...columnValues,
                }))}
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
                onRowOrderChange={handleRowOrderChange}
                onColumnOrderChange={handleColumnOrderChange}
                onCellEditCommit={handleCellEditCommit}
            />
            <DialogActions>
                <SaveButton />
            </DialogActions>
        </Dialog>
    );
};

storiesOf("@comet/admin/POC", module).add("TableBlockAdminWithDataGrid", Story);
