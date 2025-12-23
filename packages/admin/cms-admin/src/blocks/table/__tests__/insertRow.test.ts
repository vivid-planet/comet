import { fireEvent, within } from "test-utils";
import { describe, expect, it } from "vitest";

import { mockTableData } from "../__mocks__/TableBlockData.mocks";
import { renderTableBlock } from "./utils";

describe("TableBlock: Insert a new row", () => {
    it("should insert a new, empty row at the top of the table", async () => {
        const rendered = renderTableBlock(mockTableData);

        const rowOptionsButtons = rendered.getAllByLabelText(/row options/i);
        const firstRowOptionsButton = rowOptionsButtons[0];
        fireEvent.click(firstRowOptionsButton);

        const insertRowAboveButton = rendered.getByRole("menuitem", { name: /add row above/i });
        fireEvent.click(insertRowAboveButton);

        const rowgroup = rendered.getByRole("rowgroup");
        const rows = within(rowgroup).getAllByRole("row");

        const numberOfRowsAfterInsertingOne = mockTableData.rows.length + 1;
        expect(rows).toHaveLength(numberOfRowsAfterInsertingOne);

        rows.forEach((row, rowIndex) => {
            const cells = within(row).getAllByRole("gridcell");
            const cellsExcludingTheDragHandleAndActionsCells = cells.slice(1, cells.length - 1);

            cellsExcludingTheDragHandleAndActionsCells.forEach((cell, cellIndex) => {
                const isNewlyInsertedRow = rowIndex === 0;
                if (isNewlyInsertedRow) {
                    expect(cell.textContent).toBe("");
                } else {
                    const rowIndexBeforeInsertingNewRow = rowIndex - 1;
                    const cellValueBeforeInsertingNewRow = mockTableData.rows[rowIndexBeforeInsertingNewRow].cellValues[cellIndex].value;
                    expect(cell.textContent).toBe(cellValueBeforeInsertingNewRow);
                }
            });
        });
    });
});
