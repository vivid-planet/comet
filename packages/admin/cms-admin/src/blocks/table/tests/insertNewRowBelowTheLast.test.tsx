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

describe("TableBlock: Insert a new row below the last", () => {
    let rendered: ReturnType<typeof getRenderedTableBlock>;
    let initialCellValuesPerRow: CellValue[][];
    let updatedCellValuesPerRow: CellValue[][];

    beforeAll(async () => {
        rendered = getRenderedTableBlock();
        initialCellValuesPerRow = getCellValuesForAllRows(rendered);
        await openActionsMenuOfRowAtIndex(rendered, exampleTableBlockData.rows.length - 1);
        await clickInsertRowBelowButton(rendered);
        updatedCellValuesPerRow = getCellValuesForAllRows(rendered);
    });

    it("should have increased the number of rows by 1", async () => {
        const gridRowsAfterInsertingNewRow = rendered.getAllByTestId("table-block-grid-row");
        expect(gridRowsAfterInsertingNewRow).toHaveLength(exampleTableBlockData.rows.length + 1);
    });

    it("should have a new empty row at the last index", async () => {
        const newLastRowCellValues = updatedCellValuesPerRow[updatedCellValuesPerRow.length - 1];
        expect(newLastRowCellValues).toHaveLength(initialCellValuesPerRow[0].length);

        newLastRowCellValues.forEach((cellValue) => {
            expect(cellValue).toEqual("");
        });
    });

    it("should have not moved any existing rows", async () => {
        initialCellValuesPerRow.forEach((initialCellValuesForRow, index) => {
            expect(updatedCellValuesPerRow[index]).toEqual(initialCellValuesForRow);
        });
    });

    it("should have valid, unique ids in the state", async () => {
        expectValidUniqueIdsInState(rendered);
    });
});
