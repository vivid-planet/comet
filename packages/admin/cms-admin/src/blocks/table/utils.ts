import { v4 as uuid } from "uuid";
import { z } from "zod";

import { TableBlockData } from "../../blocks.generated";
import { ColumnSize } from "./TableBlockGrid";

export const clipboardRowSchema = z.object({
    highlighted: z.boolean(),
    cellValues: z.array(z.string()),
});

export type ClipboardRow = z.infer<typeof clipboardRowSchema>;

export const getNewColumn = (): TableBlockData["columns"][number] => {
    return { id: uuid(), highlighted: false, size: "standard" };
};

export const getNewRowInState = (state: TableBlockData): TableBlockData["rows"][number] => {
    const cellValues = state.columns.map((column) => ({ columnId: column.id, value: "" }));
    return { id: uuid(), highlighted: false, cellValues };
};

export const getInitialTableData = (): TableBlockData => {
    const columnIdOne = uuid();
    const columnIdTwo = uuid();

    return {
        rows: [
            {
                id: uuid(),
                highlighted: false,
                cellValues: [
                    { columnId: columnIdOne, value: "" },
                    { columnId: columnIdTwo, value: "" },
                ],
            },
            {
                id: uuid(),
                highlighted: false,
                cellValues: [
                    { columnId: columnIdOne, value: "" },
                    { columnId: columnIdTwo, value: "" },
                ],
            },
        ],
        columns: [
            {
                id: columnIdOne,
                size: "standard",
                highlighted: false,
            },
            {
                id: columnIdTwo,
                size: "standard",
                highlighted: false,
            },
        ],
    };
};

export const insertNewRowIntoState = (state: TableBlockData, where: "above" | "below", targetRowId: string): TableBlockData => {
    const targetRowIndex = state.rows.findIndex(({ id }) => id === targetRowId);
    const newRowIndex = where === "above" ? targetRowIndex : targetRowIndex + 1;

    return {
        ...state,
        rows: [...state.rows.slice(0, newRowIndex), getNewRowInState(state), ...state.rows.slice(newRowIndex)],
    };
};

export const deleteRowFromState = (state: TableBlockData, rowId: string): TableBlockData => {
    return { ...state, rows: state.rows.filter(({ id }) => id !== rowId) };
};

export const toggleHighlightOfRowInState = (state: TableBlockData, rowId: string): TableBlockData => {
    return { ...state, rows: state.rows.map((row) => ({ ...row, highlighted: row.id === rowId ? !row.highlighted : row.highlighted })) };
};

export const duplicateRowInState = (
    state: TableBlockData,
    rowId: string,
): {
    state: TableBlockData;
    success: boolean;
} => {
    const currentRowIndex = state.rows.findIndex(({ id }) => id === rowId);
    const rowToDuplicate = state.rows[currentRowIndex];

    if (!rowToDuplicate) {
        return { state, success: false };
    }

    return {
        state: {
            ...state,
            rows: [...state.rows.slice(0, currentRowIndex + 1), { ...rowToDuplicate, id: uuid() }, ...state.rows.slice(currentRowIndex + 1)],
        },
        success: true,
    };
};

export const duplicateColumnInState = (state: TableBlockData, columnId: string): { state: TableBlockData; success: boolean } => {
    const currentColumnIndex = state.columns.findIndex(({ id }) => id === columnId);
    const columnToDuplicate = state.columns[currentColumnIndex];

    if (!columnToDuplicate) {
        return { state, success: false };
    }

    const duplicatedColumn = { ...columnToDuplicate, id: uuid() };

    return {
        state: {
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
        },
        success: true,
    };
};

export const insertRowFromClipboardIntoState = (state: TableBlockData, targetRowId: string, clipboardData: ClipboardRow): TableBlockData => {
    const numberOfColumnsToAdd = clipboardData.cellValues.length - state.columns.length;

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

    const currentRowIndex = updatedRows.findIndex(({ id }) => id === targetRowId);
    const newRowToPaste: TableBlockData["rows"][number] = {
        id: uuid(),
        highlighted: clipboardData.highlighted,
        cellValues: updatedColumns.map(({ id: columnId }, index) => {
            return {
                columnId,
                value: clipboardData.cellValues[index] ?? "",
            };
        }),
    };

    return {
        ...state,
        columns: updatedColumns,
        rows: [...updatedRows.slice(0, currentRowIndex + 1), newRowToPaste, ...updatedRows.slice(currentRowIndex + 1)],
    };
};

export const insertColumnIntoState = (state: TableBlockData, newColumnIndex: number): TableBlockData => {
    const newColumn = getNewColumn();
    return {
        ...state,
        columns: [...state.columns.slice(0, newColumnIndex), newColumn, ...state.columns.slice(newColumnIndex)],
        rows: state.rows.map((row) => ({
            ...row,
            cellValues: [...row.cellValues, { columnId: newColumn.id, value: "" }],
        })),
    };
};

export const deleteColumnFromState = (state: TableBlockData, targetColumnId: string): TableBlockData => {
    return {
        ...state,
        columns: state.columns.filter((column) => column.id !== targetColumnId),
        rows: state.rows.map((row) => ({ ...row, cellValues: row.cellValues.filter((cellValue) => cellValue.columnId !== targetColumnId) })),
    };
};

export const toggleColumnHighlightInState = (state: TableBlockData, targetColumnId: string): TableBlockData => {
    return {
        ...state,
        columns: state.columns.map((column) => ({ ...column, highlighted: column.id === targetColumnId ? !column.highlighted : column.highlighted })),
    };
};

export const setColumnSizeInState = (state: TableBlockData, targetColumnId: string, size: ColumnSize): TableBlockData => {
    return { ...state, columns: state.columns.map((column) => (column.id === targetColumnId ? { ...column, size } : column)) };
};
