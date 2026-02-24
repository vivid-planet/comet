import { v4 as uuid } from "uuid";
import { z } from "zod";

import { type RichTextBlock, type RichTextBlockState } from "../../createRichTextBlock";
import { type TableBlockColumn, type TableBlockState } from "../../createTableBlock";
import { insertRowDataAtIndex, type RowInsertData } from "./row";
import { rteSchema } from "./rteSchema";

export const getNewColumn = (): TableBlockColumn => {
    return { id: uuid(), highlighted: false, size: "standard" };
};

export const columnSizeSchema = z.enum(["extraSmall", "small", "standard", "large", "extraLarge"]);
export type ColumnSize = z.infer<typeof columnSizeSchema>;

export const columnInsertSchema = z.object({
    size: columnSizeSchema,
    highlighted: z.boolean(),
    cellValues: z.array(rteSchema),
});

export type ColumnInsertData = {
    size: ColumnSize;
    highlighted: boolean;
    cellValues: RichTextBlockState[];
};

export const getNewColumnInsertData = (numberOfRows: number, RichTextBlock: RichTextBlock): ColumnInsertData => {
    return {
        size: "standard",
        highlighted: false,
        cellValues: Array.from({ length: numberOfRows }).map(() => RichTextBlock.defaultValues()),
    };
};

export const getDuplicatedColumnInsertData = (state: TableBlockState, columnIndex: number, RichTextBlock: RichTextBlock): ColumnInsertData | null => {
    const sourceColumn = state.columns[columnIndex];

    if (!sourceColumn) {
        return null;
    }

    const sourceCellsValues = state.rows.map(({ cellValues }) => cellValues.find((cellValue) => cellValue.columnId === sourceColumn.id));
    const newCellValues = sourceCellsValues.map((sourceCellValue) => sourceCellValue?.value ?? RichTextBlock.defaultValues());

    return {
        size: sourceColumn.size,
        highlighted: sourceColumn.highlighted,
        cellValues: newCellValues,
    };
};

export const getInsertDataFromColumnById = (state: TableBlockState, columnId: string, RichTextBlock: RichTextBlock): ColumnInsertData | null => {
    const column = state.columns.find(({ id }) => id === columnId);
    if (!column) {
        return null;
    }

    return {
        size: column.size,
        highlighted: column.highlighted,
        cellValues: state.rows.map((row) => {
            const cellValueOfColumn = row.cellValues.find((cellValue) => cellValue.columnId === columnId);
            return RichTextBlock.state2Output(cellValueOfColumn?.value ?? RichTextBlock.defaultValues());
        }),
    };
};

export const insertColumnDataAtIndex = (
    state: TableBlockState,
    columnInsertData: { size: ColumnSize; highlighted: boolean; cellValues: RichTextBlockState[] },
    index: number,
    RichTextBlock: RichTextBlock,
    newColumnId: string = uuid(),
): TableBlockState => {
    const numberOfRowsToBeAdded = columnInsertData.cellValues.length - state.rows.length;

    for (let i = 0; i < numberOfRowsToBeAdded; i++) {
        const newRowInsertData: RowInsertData = {
            highlighted: false,
            cellValues: state.columns.map(() => RichTextBlock.defaultValues()),
        };
        state = insertRowDataAtIndex(state, newRowInsertData, state.rows.length, RichTextBlock);
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
            const newCell = { columnId: newColumn.id, value: columnInsertData.cellValues[rowIndex] ?? RichTextBlock.defaultValues() };
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
