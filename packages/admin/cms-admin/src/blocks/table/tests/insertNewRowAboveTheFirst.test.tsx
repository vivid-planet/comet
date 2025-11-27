import "@testing-library/react/dont-cleanup-after-each";

import { exampleTableBlockData } from "./exampleTableBlockData";
import {
    type CellValue,
    clickInsertRowAboveButton,
    expectValidUniqueIdsInState,
    getCellValuesForAllRows,
    getRenderedTableBlock,
    openActionsMenuOfRowAtIndex,
} from "./utils";

describe("TableBlock: Insert a new row above the first", () => {
    let rendered: ReturnType<typeof getRenderedTableBlock>;
    let initialCellValuesPerRow: CellValue[][];
    let updatedCellValuesPerRow: CellValue[][];

    beforeAll(async () => {
        rendered = getRenderedTableBlock();
        initialCellValuesPerRow = getCellValuesForAllRows(rendered);
        await openActionsMenuOfRowAtIndex(rendered, 0);
        await clickInsertRowAboveButton(rendered);
        updatedCellValuesPerRow = getCellValuesForAllRows(rendered);
    });

    it("should have increased the number of rows by 1", async () => {
        const gridRowsAfterInsertingNewRow = rendered.getAllByTestId("table-block-grid-row");
        expect(gridRowsAfterInsertingNewRow).toHaveLength(exampleTableBlockData.rows.length + 1);
    });

    it("should have a new empty row at index 0", async () => {
        expect(updatedCellValuesPerRow[0]).toHaveLength(initialCellValuesPerRow[0].length);

        updatedCellValuesPerRow[0].forEach((cellValue) => {
            expect(cellValue).toEqual("");
        });
    });

    it("should move all existing values to the next row", async () => {
        initialCellValuesPerRow.forEach((initialCellValuesForRow, index) => {
            expect(initialCellValuesForRow).toEqual(updatedCellValuesPerRow[index + 1]);
        });
    });

    it("should have valid, unique ids in the state", async () => {
        expectValidUniqueIdsInState(rendered);
    });
});
