import { z } from "zod";

import { type RichTextBlockState } from "../../createRichTextBlock";
import { type TableBlockRowState, type TableBlockState } from "../../factories/createTableBlock";
import { getNewColumn } from "./column";

export const getNewRow = (cellValues: TableBlockRowState["cellValues"], newRowId: string = crypto.randomUUID()): TableBlockRowState => {
    return { id: newRowId, highlighted: false, cellValues };
};

// Schema for clipboard validation - uses serializable format
export const rowInsertSchema = z.object({
    highlighted: z.boolean(),
    cellValues: z.array(z.unknown()), // Can be RichTextBlockState or serialized format
});

export interface RowInsertData<T = RichTextBlockState> {
    highlighted: boolean;
    cellValues: T[];
}

export const insertRowDataAtIndex = <T>(
    state: TableBlockState,
    insertData: RowInsertData<T>,
    index: number,
    newRowId: string = crypto.randomUUID(),
): TableBlockState => {
    const updatedColumns = [...state.columns];
    const newColumnIds: string[] = [];

    const cellValuesToInsert = [...insertData.cellValues];

    const numberOfValuesWithoutColumns = cellValuesToInsert.length - updatedColumns.length;
    Array.from({ length: numberOfValuesWithoutColumns }).forEach(() => {
        const newColumn = getNewColumn();
        updatedColumns.push(newColumn);
        newColumnIds.push(newColumn.id);
    });

    const numberOfColumnsWithoutNewValue = updatedColumns.length - cellValuesToInsert.length;
    Array.from({ length: numberOfColumnsWithoutNewValue }).forEach(() => {
        // This shouldn't happen in normal usage, but provide a fallback
        cellValuesToInsert.push(cellValuesToInsert[0]);
    });

    const newRow = getNewRow(
        cellValuesToInsert.map((value, idx) => {
            return { columnId: updatedColumns[idx].id, value: value as RichTextBlockState };
        }),
        newRowId,
    );

    let rowsBeforeTargetIndex = state.rows.slice(0, index);
    let rowsAfterTargetIndex = state.rows.slice(index);

    newColumnIds.forEach((newColumnId) => {
        rowsBeforeTargetIndex = rowsBeforeTargetIndex.map((row) => ({
            ...row,
            cellValues: [...row.cellValues, { columnId: newColumnId, value: cellValuesToInsert[0] as RichTextBlockState }],
        }));
        rowsAfterTargetIndex = rowsAfterTargetIndex.map((row) => ({
            ...row,
            cellValues: [...row.cellValues, { columnId: newColumnId, value: cellValuesToInsert[0] as RichTextBlockState }],
        }));
    });

    return {
        ...state,
        columns: updatedColumns,
        rows: [...rowsBeforeTargetIndex, newRow, ...rowsAfterTargetIndex],
    };
};

export const deleteRowById = (state: TableBlockState, rowIdToDelete: string): TableBlockState => {
    return {
        ...state,
        rows: state.rows.filter(({ id }) => id !== rowIdToDelete),
    };
};

export const getInsertDataFromRowById = (state: TableBlockState, rowId: string): RowInsertData | null => {
    const row = state.rows.find(({ id }) => id === rowId);
    if (!row) {
        return null;
    }

    const cellValuesInOrderOfColumns = state.columns.map((column: TableBlockState["columns"][number]) => {
        return row.cellValues.find((cellValue) => cellValue.columnId === column.id)?.value as RichTextBlockState;
    });

    return {
        highlighted: row.highlighted,
        cellValues: cellValuesInOrderOfColumns,
    };
};
