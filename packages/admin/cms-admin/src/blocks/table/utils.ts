import { v4 as uuid } from "uuid";

import { type TableBlockData } from "../../blocks.generated";

export const getNewColumn = (): TableBlockData["columns"][number] => {
    return { id: uuid(), highlighted: false, size: "standard" };
};

export const getNewRow = (cellValues: TableBlockData["rows"][number]["cellValues"]): TableBlockData["rows"][number] => {
    return { id: uuid(), highlighted: false, cellValues };
};

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
