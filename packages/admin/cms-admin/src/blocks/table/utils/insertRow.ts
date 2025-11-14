import { v4 as uuid } from "uuid";

import { type TableBlockData } from "../../../blocks.generated";

export const insertRow = (state: TableBlockData, rowId: string, where: "above" | "below"): TableBlockData => {
    const currentRowIndex = state.rows.findIndex(({ id }) => id === rowId);
    const newRowIndex = where === "above" ? currentRowIndex : currentRowIndex + 1;

    const cellValuesOfNewRow: TableBlockData["rows"][number]["cellValues"] = state.columns.map((column) => ({ columnId: column.id, value: "" }));
    const newRow: TableBlockData["rows"][number] = { id: uuid(), highlighted: false, cellValues: cellValuesOfNewRow };

    return {
        ...state,
        rows: [...state.rows.slice(0, newRowIndex), newRow, ...state.rows.slice(newRowIndex)],
    };
};
