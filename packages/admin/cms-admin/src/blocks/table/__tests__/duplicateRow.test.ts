import { within } from "test-utils";

import { mockTableData } from "../__mocks__/TableBlockData.mocks";
import { clickButtonOfRowAtIndex, renderTableBlock } from "./utils";

describe("TableBlock: Duplicate a row", () => {
    it("should have a new row with the same values as the source row", async () => {
        const rendered = renderTableBlock(mockTableData);
        const sourceRowIndex = 2;

        clickButtonOfRowAtIndex(rendered, sourceRowIndex, /duplicate/i);

        const rowgroup = rendered.getByRole("rowgroup");
        const rows = within(rowgroup).getAllByRole("row");
        const sourceRowElement = rows[sourceRowIndex];
        const sourceRowCells = within(sourceRowElement).getAllByRole("gridcell");

        const newRowElement = rows[sourceRowIndex + 1];
        const newRowCells = within(newRowElement).getAllByRole("gridcell");

        const numberOfRowsAfterInsertingOne = mockTableData.rows.length + 1;
        expect(rows).toHaveLength(numberOfRowsAfterInsertingOne);

        const sourceRowValues = mockTableData.rows[sourceRowIndex].cellValues.map((cellValue) => cellValue.value);

        sourceRowValues.forEach((originalCellValueInSourceRow, index) => {
            const offsetForCellsWithActualContent = 1;
            const cellIndexInSourceRow = index + offsetForCellsWithActualContent;

            const currentCellValueInSourceRow = sourceRowCells[cellIndexInSourceRow].textContent;
            const currentCellValueInNewRow = newRowCells[cellIndexInSourceRow].textContent;

            expect(currentCellValueInSourceRow).toBe(originalCellValueInSourceRow);
            expect(currentCellValueInNewRow).toBe(originalCellValueInSourceRow);
        });
    });
});
