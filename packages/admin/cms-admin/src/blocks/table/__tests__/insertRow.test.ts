import { cleanup, within } from "test-utils";
import { afterEach, describe, expect, it } from "vitest";

import { mockTableData } from "../__mocks__/TableBlockData.mocks";
import { clickButtonOfRowAtIndex, renderTableBlock } from "./utils";

afterEach(cleanup);

describe("TableBlock: Insert a new row", () => {
    it("should insert a new, empty row at the top of the table", async () => {
        const rendered = renderTableBlock(mockTableData);

        clickButtonOfRowAtIndex(rendered, 0, /add row above/i);

        const rowgroup = rendered.getByRole("rowgroup");
        const rows = within(rowgroup).getAllByRole("row");

        const numberOfRowsAfterInserting = mockTableData.rows.length + 1;
        expect(rows).toHaveLength(numberOfRowsAfterInserting);

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
    it("should insert a new, empty row at the bottom of the table", async () => {
        const rendered = renderTableBlock(mockTableData);
        const targetRowIndex = mockTableData.rows.length - 1;

        clickButtonOfRowAtIndex(rendered, targetRowIndex, /add row below/i);

        const rowgroup = rendered.getByRole("rowgroup");
        const rows = within(rowgroup).getAllByRole("row");

        const numberOfRowsAfterInserting = mockTableData.rows.length + 1;
        expect(rows).toHaveLength(numberOfRowsAfterInserting);

        rows.forEach((row, rowIndex) => {
            const cells = within(row).getAllByRole("gridcell");
            const cellsExcludingTheDragHandleAndActionsCells = cells.slice(1, cells.length - 1);

            cellsExcludingTheDragHandleAndActionsCells.forEach((cell, cellIndex) => {
                const isNewlyInsertedRow = rowIndex === targetRowIndex + 1;
                if (isNewlyInsertedRow) {
                    expect(cell.textContent).toBe("");
                } else {
                    const originalCellValue = mockTableData.rows[rowIndex].cellValues[cellIndex].value;
                    expect(cell.textContent).toBe(originalCellValue);
                }
            });
        });
    });
    it("should insert a new, empty row in the middle of the table", async () => {
        const rendered = renderTableBlock(mockTableData);
        const targetRowIndex = 2;

        clickButtonOfRowAtIndex(rendered, targetRowIndex, /add row below/i);

        const rowgroup = rendered.getByRole("rowgroup");
        const rows = within(rowgroup).getAllByRole("row");

        const numberOfRowsAfterInserting = mockTableData.rows.length + 1;
        expect(rows).toHaveLength(numberOfRowsAfterInserting);

        rows.forEach((row, rowIndex) => {
            const cells = within(row).getAllByRole("gridcell");
            const cellsExcludingTheDragHandleAndActionsCells = cells.slice(1, cells.length - 1);

            cellsExcludingTheDragHandleAndActionsCells.forEach((cell, cellIndex) => {
                const isNewlyInsertedRow = rowIndex === targetRowIndex + 1;
                const isBeforeNewlyInsertedRow = rowIndex <= targetRowIndex;
                const isAfterNewlyInsertedRow = rowIndex > targetRowIndex + 1;

                if (isNewlyInsertedRow) {
                    expect(cell.textContent).toBe("");
                }

                if (isBeforeNewlyInsertedRow) {
                    const originalCellValue = mockTableData.rows[rowIndex].cellValues[cellIndex].value;
                    expect(cell.textContent).toBe(originalCellValue);
                }

                if (isAfterNewlyInsertedRow) {
                    const originalValueOfCellBelow = mockTableData.rows[rowIndex - 1].cellValues[cellIndex].value;
                    expect(cell.textContent).toBe(originalValueOfCellBelow);
                }
            });
        });
    });
});
