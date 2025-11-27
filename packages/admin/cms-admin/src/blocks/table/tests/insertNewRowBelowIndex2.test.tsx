import "@testing-library/react/dont-cleanup-after-each";

import { exampleTableBlockData } from "./exampleTableBlockData";
import {
    type CellValue,
    clickInsertRowBelowButton,
    expectValidUniqueIdsInState,
    getCellValuesForAllRows,
    getRenderedTableBlock,
    openActionsMenuOfRowAtIndex,
} from "./utils";

describe("TableBlock: Insert a new row below row at index 2", () => {
    let rendered: ReturnType<typeof getRenderedTableBlock>;
    let initialCellValuesPerRow: CellValue[][];
    let updatedCellValuesPerRow: CellValue[][];

    beforeAll(async () => {
        rendered = getRenderedTableBlock();
        initialCellValuesPerRow = getCellValuesForAllRows(rendered);
        await openActionsMenuOfRowAtIndex(rendered, 2);
        await clickInsertRowBelowButton(rendered);
        updatedCellValuesPerRow = getCellValuesForAllRows(rendered);
    });

    it("should have increased the number of rows by 1", async () => {
        const gridRowsAfterInsertingNewRow = rendered.getAllByTestId("table-block-grid-row");
        expect(gridRowsAfterInsertingNewRow).toHaveLength(exampleTableBlockData.rows.length + 1);
    });

    it("should have a new empty row at index 3", async () => {
        expect(updatedCellValuesPerRow[3]).toHaveLength(initialCellValuesPerRow[3].length);

        updatedCellValuesPerRow[3].forEach((cellValue) => {
            expect(cellValue).toEqual("");
        });
    });

    it("should not move values above index 3", async () => {
        initialCellValuesPerRow.slice(0, 3).forEach((initialCellValuesForRow, index) => {
            expect(updatedCellValuesPerRow[index]).toEqual(initialCellValuesForRow);
        });
    });

    it("should move values below index 3 to the next index", async () => {
        const initialCellValuesBelowIndex3 = initialCellValuesPerRow.slice(3);
        const updatedCellValuesBelowIndex3 = updatedCellValuesPerRow.slice(3);

        initialCellValuesBelowIndex3.forEach((initialCellValuesForRow, index) => {
            expect(initialCellValuesForRow).toEqual(updatedCellValuesBelowIndex3[index + 1]);
        });
    });

    it("should have valid, unique ids in the state", async () => {
        expectValidUniqueIdsInState(rendered);
    });
});
