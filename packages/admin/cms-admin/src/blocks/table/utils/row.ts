import { v4 as uuid } from "uuid";
import { z } from "zod";

import { type TableBlockData } from "../../../blocks.generated";

export const getNewRow = (cellValues: TableBlockData["rows"][number]["cellValues"]): TableBlockData["rows"][number] => {
    return { id: uuid(), highlighted: false, cellValues };
};

export const clipboardRowSchema = z.object({
    type: z.literal("tableBlockRow"),
    highlighted: z.boolean(),
    cellValues: z.array(z.string()),
});

export type ClipboardRow = z.infer<typeof clipboardRowSchema>;

export const insertRowAtIndex = (state: TableBlockData, newRow: TableBlockData["rows"][number], index: number) => {
    const rowsBeforeIndex = state.rows.slice(0, index);
    const rowsAfterIndex = state.rows.slice(index);
    return { ...state, rows: [...rowsBeforeIndex, newRow, ...rowsAfterIndex] };
};
