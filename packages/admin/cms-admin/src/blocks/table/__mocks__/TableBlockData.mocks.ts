import { v4 as uuid } from "uuid";

import { type TableBlockData } from "../../../blocks.generated";
import { type ColumnInsertData } from "../utils/column";
import { getInitialTableData } from "../utils/tableData";

export const columnInsertDataWithFiveValues: ColumnInsertData = {
    size: "standard",
    highlighted: false,
    cellValues: ["Created date", "2025-11-27", "2025-05-12", "2024-09-18", "2025-02-20"],
};

const getDefaultData = (): TableBlockData => {
    const smallHighlightedColumn: TableBlockData["columns"][number] = {
        id: uuid(),
        size: "small",
        highlighted: true,
    };

    const firstStandardColumn: TableBlockData["columns"][number] = {
        id: uuid(),
        size: "standard",
        highlighted: false,
    };

    const secondStandardColumn: TableBlockData["columns"][number] = {
        id: uuid(),
        size: "standard",
        highlighted: false,
    };

    const extraLargeColumn: TableBlockData["columns"][number] = {
        id: uuid(),
        highlighted: false,
        size: "extraLarge",
    };

    const headerRow: TableBlockData["rows"][number] = {
        id: uuid(),
        highlighted: true,
        cellValues: [
            { columnId: smallHighlightedColumn.id, value: "Product ID" },
            { columnId: firstStandardColumn.id, value: "Inventor" },
            { columnId: secondStandardColumn.id, value: "Product name" },
            { columnId: extraLargeColumn.id, value: "Product description" },
        ],
    };

    const dataRowOne: TableBlockData["rows"][number] = {
        id: uuid(),
        highlighted: false,
        cellValues: [
            { columnId: smallHighlightedColumn.id, value: "p1" },
            { columnId: firstStandardColumn.id, value: "Chelsea Kuvalis" },
            { columnId: secondStandardColumn.id, value: "Tasty Frozen Keyboard" },
            { columnId: extraLargeColumn.id, value: "Carbonite web goalkeeper gloves are ergonomically designed to give easy fit" },
        ],
    };

    const dataRowTwo: TableBlockData["rows"][number] = {
        id: uuid(),
        highlighted: false,
        cellValues: [
            { columnId: smallHighlightedColumn.id, value: "p2" },
            { columnId: firstStandardColumn.id, value: "Randal Renner" },
            { columnId: secondStandardColumn.id, value: "Practical Granite Chips" },
            {
                columnId: extraLargeColumn.id,
                value: "New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016",
            },
        ],
    };

    const dataRowThree: TableBlockData["rows"][number] = {
        id: uuid(),
        highlighted: false,
        cellValues: [
            { columnId: smallHighlightedColumn.id, value: "p3" },
            { columnId: firstStandardColumn.id, value: "Greg Bednar" },
            { columnId: secondStandardColumn.id, value: "Licensed Soft Keyboard" },
            {
                columnId: extraLargeColumn.id,
                value: "The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality",
            },
        ],
    };

    const dataRowFour: TableBlockData["rows"][number] = {
        id: uuid(),
        highlighted: false,
        cellValues: [
            { columnId: smallHighlightedColumn.id, value: "p4" },
            { columnId: firstStandardColumn.id, value: "Julio Von" },
            { columnId: secondStandardColumn.id, value: "Tasty Wooden Gloves" },
            {
                columnId: extraLargeColumn.id,
                value: "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients",
            },
        ],
    };

    return {
        columns: [smallHighlightedColumn, firstStandardColumn, secondStandardColumn, extraLargeColumn],
        rows: [headerRow, dataRowOne, dataRowTwo, dataRowThree, dataRowFour],
    };
};

const getDataWithTwoColumnsAndTwoRows = (): TableBlockData => {
    const columnIdOne = uuid();
    const columnIdTwo = uuid();

    return {
        columns: [
            { id: columnIdOne, size: "standard", highlighted: false },
            { id: columnIdTwo, size: "standard", highlighted: false },
        ],
        rows: [
            {
                id: uuid(),
                highlighted: false,
                cellValues: [
                    { columnId: columnIdOne, value: "Row 1 / Column 1" },
                    { columnId: columnIdTwo, value: "Row 1 / Column 2" },
                ],
            },
            {
                id: uuid(),
                highlighted: false,
                cellValues: [
                    { columnId: columnIdOne, value: "Row 2 / Column 1" },
                    { columnId: columnIdTwo, value: "Row 2 / Column 2" },
                ],
            },
        ],
    };
};

export const mockBlockDataObjects: Record<string, TableBlockData> = {
    initial: getInitialTableData(),
    default: getDefaultData(),
    twoColumnsAndTwoRows: getDataWithTwoColumnsAndTwoRows(),
    empty: { columns: [], rows: [] },
};
