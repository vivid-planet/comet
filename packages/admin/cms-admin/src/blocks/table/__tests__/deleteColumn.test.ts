import { within } from "test-utils";
import { describe, expect, it } from "vitest";

import { mockBlockDataObjects } from "../__mocks__/TableBlockData.mocks";
import { clickButtonOfColumnAtIndex, renderTableBlock } from "./utils";

describe("TableBlock: Delete a column", () => {
    it("should delete a certain column", async () => {
        const rendered = renderTableBlock(mockBlockDataObjects.default);
        const targetColumnIndex = 2;

        const rowgroup = rendered.getByRole("rowgroup");
        const rows = within(rowgroup).getAllByRole("row");
        const originalNumberOfCellsInRow = within(rows[0]).getAllByRole("gridcell").length;

        const originalCellValuesPerRow = rows.map((rowElement) =>
            within(rowElement)
                .getAllByRole("gridcell")
                .map((cell) => cell.textContent),
        );

        clickButtonOfColumnAtIndex(rendered, targetColumnIndex, /delete/i);

        const newCellValuesPerRow = rows.map((rowElement) =>
            within(rowElement)
                .getAllByRole("gridcell")
                .map((cell) => cell.textContent),
        );

        newCellValuesPerRow.forEach((newCellValues, rowIndex) => {
            expect(newCellValues).toHaveLength(originalNumberOfCellsInRow - 1);
            const indexOffsetForDragHandleCell = 1;
            const actualSourceColumnIndex = targetColumnIndex + indexOffsetForDragHandleCell;

            newCellValues.forEach((newCellValue, cellIndex) => {
                const newCellIsBeforeDeletedColumn = cellIndex < actualSourceColumnIndex;
                const newCellIsDeletedColumn = cellIndex === actualSourceColumnIndex;
                const newCellIsAfterDeletedColumn = cellIndex > actualSourceColumnIndex;

                const originalValueOfCell = originalCellValuesPerRow[rowIndex][cellIndex];
                const originalValueOfCellToTheRight = originalCellValuesPerRow[rowIndex][cellIndex + 1];

                if (newCellIsBeforeDeletedColumn) {
                    expect(newCellValue).toBe(originalValueOfCell);
                }

                if (newCellIsDeletedColumn || newCellIsAfterDeletedColumn) {
                    expect(newCellValue).toBe(originalValueOfCellToTheRight);
                }
            });
        });
    });
});
