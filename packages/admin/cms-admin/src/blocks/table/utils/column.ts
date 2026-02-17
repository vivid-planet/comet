import { z } from "zod";

import { type RichTextBlockState } from "../../createRichTextBlock";
import { type TableBlockColumn, type TableBlockState } from "../../factories/createTableBlock";
import { insertRowDataAtIndex, type RowInsertData } from "./row";

export const getNewColumn = (): TableBlockColumn => {
    return { id: crypto.randomUUID(), highlighted: false, size: "standard" };
};

export const columnSizeSchema = z.enum(["extraSmall", "small", "standard", "large", "extraLarge"]);
export type ColumnSize = z.infer<typeof columnSizeSchema>;

// Schema for clipboard validation - uses serializable format
export const columnInsertSchema = z.object({
    size: columnSizeSchema,
    highlighted: z.boolean(),
    cellValues: z.array(z.unknown()), // Can be RichTextBlockState or serialized format
});

export interface ColumnInsertData {
    size: ColumnSize;
    highlighted: boolean;
    cellValues: RichTextBlockState[];
}

export const getDuplicatedColumnInsertData = (state: TableBlockState, columnIndex: number): ColumnInsertData | null => {
    const sourceColumn = state.columns[columnIndex];

    if (!sourceColumn) {
        return null;
    }

    const sourceCellsValues = state.rows.map(({ cellValues }) => cellValues.find((cellValue) => cellValue.columnId === sourceColumn.id));
    const newCellValues = sourceCellsValues.map((sourceCellValue) => sourceCellValue?.value as RichTextBlockState);

    return {
        size: sourceColumn.size,
        highlighted: sourceColumn.highlighted,
        cellValues: newCellValues,
    };
};

export const getInsertDataFromColumnById = (state: TableBlockState, columnId: string): ColumnInsertData | null => {
    const column = state.columns.find(({ id }) => id === columnId);
    if (!column) {
        return null;
    }

    return {
        size: column.size,
        highlighted: column.highlighted,
        cellValues: state.rows.map((row) => {
            const cellValueOfColumn = row.cellValues.find((cellValue) => cellValue.columnId === columnId);
            return cellValueOfColumn?.value as RichTextBlockState;
        }),
    };
};

export const insertColumnDataAtIndex = <T>(
    state: TableBlockState,
    columnInsertData: { size: ColumnSize; highlighted: boolean; cellValues: T[] },
    index: number,
    newColumnId: string = crypto.randomUUID(),
): TableBlockState => {
    const numberOfRowsToBeAdded = columnInsertData.cellValues.length - state.rows.length;

    for (let i = 0; i < numberOfRowsToBeAdded; i++) {
        const newRowInsertData: RowInsertData<T> = {
            highlighted: false,
            cellValues: state.columns.map(() => columnInsertData.cellValues[0]) as T[],
        };
        state = insertRowDataAtIndex(state, newRowInsertData, state.rows.length);
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
        rows: state.rows.map((row, rowIndex) => {
            const newCell = { columnId: newColumn.id, value: columnInsertData.cellValues[rowIndex] as RichTextBlockState };
            return {
                ...row,
                cellValues: [...row.cellValues, newCell],
            };
        }),
    };
};

export const removeColumnFromState = (state: TableBlockState, columnId: string): TableBlockState => {
    return {
        ...state,
        columns: state.columns.filter((column) => column.id !== columnId),
        rows: state.rows.map((row) => ({
            ...row,
            cellValues: row.cellValues.filter((cellValue) => cellValue.columnId !== columnId),
        })),
    };
};

export const toggleColumnHighlight = (state: TableBlockState, columnId: string): TableBlockState => {
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

export const setColumnSize = (state: TableBlockState, columnId: string, size: ColumnSize): TableBlockState => {
    return {
        ...state,
        columns: state.columns.map((column) => (column.id === columnId ? { ...column, size } : column)),
    };
};
