import { v4 as uuid } from "uuid";

import { type TableBlockData } from "../../../blocks.generated";
import { getNewColumnInsertData, insertColumnDataAtIndex } from "./column";
import { insertRowDataAtIndex } from "./row";

export const getInitialTableData = (): {
    rows: TableBlockData["rows"];
    columns: TableBlockData["columns"];
} => {
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

export const ensureMinimumTableData = (state: TableBlockData): TableBlockData => {
    let result = state;

    if (result.columns.length === 0) {
        const newColumnInsertData = getNewColumnInsertData(result.rows.length);
        result = insertColumnDataAtIndex(result, newColumnInsertData, 0);
    }

    if (result.rows.length === 0) {
        const newRowInsertData = { highlighted: false, cellValues: [] };
        result = insertRowDataAtIndex(result, newRowInsertData, 0);
    }

    return result;
};
