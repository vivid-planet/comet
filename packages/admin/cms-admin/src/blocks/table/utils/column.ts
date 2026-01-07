import { v4 as uuid } from "uuid";
import { z } from "zod";

import { type TableBlockData } from "../../../blocks.generated";
import { getNewRow, insertRowAtIndex } from "./row";

export const getNewColumn = (): TableBlockData["columns"][number] => {
    return { id: uuid(), highlighted: false, size: "standard" };
};

export const columnSizeSchema = z.enum(["extraSmall", "small", "standard", "large", "extraLarge"]);
export type ColumnSize = z.infer<typeof columnSizeSchema>;

export const columnInsertSchema = z.object({
    size: columnSizeSchema,
    highlighted: z.boolean(),
    cellValues: z.array(z.string()),
});
export type ColumnInsertData = z.infer<typeof columnInsertSchema>;

export const getNewColumnInsertData = (numberOfRows: number): ColumnInsertData => {
    return {
        size: "standard",
        highlighted: false,
        cellValues: Array.from({ length: numberOfRows }).map(() => ""),
    };
};

export const getDuplicatedColumnInsertData = (state: TableBlockData, columnIndex: number): ColumnInsertData | null => {
    const sourceColumn = state.columns[columnIndex];

    if (!sourceColumn) {
        return null;
    }

    const sourceCellsValues = state.rows.map(({ cellValues }) => cellValues.find((cellValue) => cellValue.columnId === sourceColumn.id));
    const newCellValues = sourceCellsValues.map((sourceCellValue) => sourceCellValue?.value ?? "");

    return {
        size: sourceColumn.size,
        highlighted: sourceColumn.highlighted,
        cellValues: newCellValues,
    };
};

export const getInsertDataFromColumnById = (state: TableBlockData, columnId: string): ColumnInsertData | null => {
    const column = state.columns.find(({ id }) => id === columnId);
    if (!column) {
        return null;
    }

    return {
        size: column.size,
        highlighted: column.highlighted,
        cellValues: state.rows.map((row) => {
            const cellValueOfColumn = row.cellValues.find((cellValue) => cellValue.columnId === columnId);
            return cellValueOfColumn?.value ?? "";
        }),
    };
};

export const insertColumnDataAtIndex = (
    state: TableBlockData,
    columnInsertData: ColumnInsertData,
    index: number,
    newColumnId: string = uuid(),
): TableBlockData => {
    const numberOfRowsToBeAdded = columnInsertData.cellValues.length - state.rows.length;

    for (let i = 0; i < numberOfRowsToBeAdded; i++) {
        const newRow = getNewRow(state.columns.map((column) => ({ columnId: column.id, value: "" })));
        state = insertRowAtIndex(state, newRow, state.rows.length);
    }

    const columnsBeforeIndex = state.columns.slice(0, index);
    const columnsAfterIndex = state.columns.slice(index);
    const newColumn = {
        id: newColumnId,
        size: columnInsertData.size,
        highlighted: columnInsertData.highlighted,
    };

    return {
        ...state,
        columns: [...columnsBeforeIndex, newColumn, ...columnsAfterIndex],
        rows: state.rows.map((row, index) => {
            const newCell = { columnId: newColumn.id, value: columnInsertData.cellValues[index] ?? "" };
            return {
                ...row,
                cellValues: [...row.cellValues, newCell],
            };
        }),
    };
};

export const removeColumnFromState = (state: TableBlockData, columnId: string): TableBlockData => {
    return {
        ...state,
        columns: state.columns.filter((column) => column.id !== columnId),
        rows: state.rows.map((row) => ({
            ...row,
            cellValues: row.cellValues.filter((cellValue) => cellValue.columnId !== columnId),
        })),
    };
};

export const toggleColumnHighlight = (state: TableBlockData, columnId: string): TableBlockData => {
    return {
        ...state,
        columns: state.columns.map((column) => {
            if (column.id === columnId) {
                return { ...column, highlighted: !column.highlighted };
            }
            return column;
        }),
    };
};

export const setColumnSize = (state: TableBlockData, columnId: string, size: ColumnSize): TableBlockData => {
    return {
        ...state,
        columns: state.columns.map((column) => (column.id === columnId ? { ...column, size } : column)),
    };
};
