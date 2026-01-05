import { v4 as uuid } from "uuid";
import { z } from "zod";

import { type TableBlockData } from "../../../blocks.generated";

export const getNewRow = (cellValues: TableBlockData["rows"][number]["cellValues"]): TableBlockData["rows"][number] => {
    return { id: uuid(), highlighted: false, cellValues };
};

export const rowInsertSchema = z.object({
    highlighted: z.boolean(),
    cellValues: z.array(z.string()),
});

type RowInsertData = z.infer<typeof rowInsertSchema>;

export const insertRowAtIndex = (state: TableBlockData, newRow: TableBlockData["rows"][number], index: number) => {
    const rowsBeforeIndex = state.rows.slice(0, index);
    const rowsAfterIndex = state.rows.slice(index);
    return { ...state, rows: [...rowsBeforeIndex, newRow, ...rowsAfterIndex] };
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
