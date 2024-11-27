import { v4 as uuid } from "uuid";

import { TableBlockData } from "../../blocks.generated";

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
                position: 1,
                highlighted: false,
                cellValues: [
                    { columnId: columnIdOne, value: "" },
                    { columnId: columnIdTwo, value: "" },
                ],
            },
            {
                id: uuid(),
                position: 2,
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
