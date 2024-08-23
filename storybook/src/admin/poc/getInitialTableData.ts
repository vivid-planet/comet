import { v4 as uuid } from "uuid";

import { ColumnDataItem, RowData } from "./TableBlockAdminWithDataGrid";

export const getInitialTableData = (): {
    rows: RowData[];
    columns: ColumnDataItem[];
} => {
    const columnIdOne = uuid();
    const columnIdTwo = uuid();

    return {
        rows: [
            {
                id: uuid(),
                position: 1,
                highlighted: false,
                columnValues: {
                    [columnIdOne]: "Row 1, Column 1",
                    [columnIdTwo]: "Row 1, Column 2",
                },
            },
            {
                id: uuid(),
                position: 2,
                highlighted: false,
                columnValues: {
                    [columnIdOne]: "Row 2, Column 1",
                    [columnIdTwo]: "Row 2, Column 2",
                },
            },
        ],
        columns: [
            {
                id: columnIdOne,
                position: 1,
                size: "standard",
                highlighted: false,
            },
            {
                id: columnIdTwo,
                position: 2,
                size: "standard",
                highlighted: false,
            },
        ],
    };
};
