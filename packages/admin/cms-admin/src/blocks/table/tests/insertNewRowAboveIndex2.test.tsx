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

describe("TableBlock: Insert a new row above row at index 2", () => {
    let rendered: ReturnType<typeof getRenderedTableBlock>;
    let initialCellValuesPerRow: CellValue[][];
    let updatedCellValuesPerRow: CellValue[][];

    beforeAll(async () => {
        rendered = getRenderedTableBlock();
        initialCellValuesPerRow = getCellValuesForAllRows(rendered);
        await openActionsMenuOfRowAtIndex(rendered, 2);
        await clickInsertRowAboveButton(rendered);
        updatedCellValuesPerRow = getCellValuesForAllRows(rendered);
    });

    it("should have increased the number of rows by 1", async () => {
        const gridRowsAfterInsertingNewRow = rendered.getAllByTestId("table-block-grid-row");
        expect(gridRowsAfterInsertingNewRow).toHaveLength(exampleTableBlockData.rows.length + 1);
    });

    it("should have a new empty row at index 2", async () => {
        expect(updatedCellValuesPerRow[2]).toHaveLength(initialCellValuesPerRow[2].length);

        updatedCellValuesPerRow[2].forEach((cellValue) => {
            expect(cellValue).toEqual("");
        });
    });

    it("should not move values above index 2", async () => {
        initialCellValuesPerRow.slice(0, 2).forEach((initialCellValuesForRow, index) => {
            expect(updatedCellValuesPerRow[index]).toEqual(initialCellValuesForRow);
        });
    });

    it("should move values below index 2 to the next index", async () => {
        const initialCellValuesBelowIndex2 = initialCellValuesPerRow.slice(2);
        const updatedCellValuesBelowIndex2 = updatedCellValuesPerRow.slice(2);

        initialCellValuesBelowIndex2.forEach((initialCellValuesForRow, index) => {
            expect(initialCellValuesForRow).toEqual(updatedCellValuesBelowIndex2[index + 1]);
        });
    });

    it("should have valid, unique ids in the state", async () => {
        expectValidUniqueIdsInState(rendered);
    });
});
