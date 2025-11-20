import { type TableBlockData } from "../../../blocks.generated";

const smallHighlightedColumn: TableBlockData["columns"][number] = {
    id: "d7bc6f8f-9b86-44e4-ac74-291bef074b9d",
    size: "small",
    highlighted: true,
};

const firstStandardColumn: TableBlockData["columns"][number] = {
    id: "92c2d68c-7804-4fb6-8f02-ffc4bdaf22d0",
    size: "standard",
    highlighted: false,
};

const secondStandardColumn: TableBlockData["columns"][number] = {
    id: "cb8bd2e3-2388-45e3-9e47-78ae8370846d",
    size: "standard",
    highlighted: false,
};

const extraLargeColumn: TableBlockData["columns"][number] = {
    id: "376c7ea0-2c91-497c-9ad0-d40ee948f78c",
    highlighted: false,
    size: "extraLarge",
};

const headerRow: TableBlockData["rows"][number] = {
    id: "6a5dc6a9-b58e-465a-b0d7-75e09fdb4f10",
    highlighted: true,
    cellValues: [
        { columnId: smallHighlightedColumn.id, value: "Product ID" },
        { columnId: firstStandardColumn.id, value: "Inventor" },
        { columnId: secondStandardColumn.id, value: "Product name" },
        { columnId: extraLargeColumn.id, value: "Product description" },
    ],
};

const dataRowOne: TableBlockData["rows"][number] = {
    id: "b76d3afa-f2d4-4952-bf35-e3ea8aed9f41",
    highlighted: false,
    cellValues: [
        { columnId: smallHighlightedColumn.id, value: "p1" },
        { columnId: firstStandardColumn.id, value: "Chelsea Kuvalis" },
        { columnId: secondStandardColumn.id, value: "Tasty Frozen Keyboard" },
        { columnId: extraLargeColumn.id, value: "Carbonite web goalkeeper gloves are ergonomically designed to give easy fit" },
    ],
};

const dataRowTwo: TableBlockData["rows"][number] = {
    id: "dce30e71-dd61-46ee-8590-3c192e675248",
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
    id: "2543ff7f-761f-4b34-9202-de33e3828599",
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
    id: "bf947237-2211-4bd7-82a8-e0875f3e7fce",
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

export const exampleTableBlockData: TableBlockData = {
    columns: [smallHighlightedColumn, firstStandardColumn, secondStandardColumn, extraLargeColumn],
    rows: [headerRow, dataRowOne, dataRowTwo, dataRowThree, dataRowFour],
};
