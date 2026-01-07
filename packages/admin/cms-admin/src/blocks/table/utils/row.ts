import { v4 as uuid } from "uuid";
import { z } from "zod";

import { type TableBlockData } from "../../../blocks.generated";
import { getNewColumn } from "./column";

export const getNewRow = (cellValues: TableBlockData["rows"][number]["cellValues"], newRowId: string = uuid()): TableBlockData["rows"][number] => {
    return { id: newRowId, highlighted: false, cellValues };
};

export const rowInsertSchema = z.object({
    highlighted: z.boolean(),
    cellValues: z.array(z.string()),
});

export type RowInsertData = z.infer<typeof rowInsertSchema>;

export const insertRowDataAtIndex = (state: TableBlockData, insertData: RowInsertData, index: number, newRowId: string = uuid()) => {
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
        cellValuesToInsert.push("");
    });

    const newRow = getNewRow(
        cellValuesToInsert.map((value, index) => {
            return { columnId: updatedColumns[index].id, value };
        }),
        newRowId,
    );

    let rowsBeforeTargetIndex = state.rows.slice(0, index);
    let rowsAfterTargetIndex = state.rows.slice(index);

    newColumnIds.forEach((newColumnId) => {
        rowsBeforeTargetIndex = rowsBeforeTargetIndex.map((row) => ({
            ...row,
            cellValues: [...row.cellValues, { columnId: newColumnId, value: "" }],
        }));
        rowsAfterTargetIndex = rowsAfterTargetIndex.map((row) => ({
            ...row,
            cellValues: [...row.cellValues, { columnId: newColumnId, value: "" }],
        }));
    });

    return {
        ...state,
        columns: updatedColumns,
        rows: [...rowsBeforeTargetIndex, newRow, ...rowsAfterTargetIndex],
    };
};

export const getInsertDataFromRowById = (state: TableBlockData, rowId: string): RowInsertData | null => {
    const row = state.rows.find(({ id }) => id === rowId);
    if (!row) {
        return null;
    }

    const cellValuesInOrderOfColumns = state.columns.map((column) => {
        return row.cellValues.find((cellValue) => cellValue.columnId === column.id)?.value ?? "";
    });

    return {
        highlighted: row.highlighted,
        cellValues: cellValuesInOrderOfColumns,
    };
};
