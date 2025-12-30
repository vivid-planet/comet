import { userEvent } from "@testing-library/user-event";
import { cleanup, waitFor, within } from "test-utils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { mockTableData } from "../__mocks__/TableBlockData.mocks";
import { type ClipboardRow } from "../RowActionsCell";
import { clickButtonOfRowAtIndex, renderTableBlock } from "./utils";

const waitForClipboardToHaveValue = async () => {
    await waitFor(() => {
        expect(navigator.clipboard.readText()).resolves.not.toBe("");
    });
};

afterEach(cleanup);

describe("TableBlock: Copy and paste a row", () => {
    beforeEach(() => {
        // Enable clipboard access in tests
        userEvent.setup();
    });

    it("should copy a certain row and paste it below another row", async () => {
        const sourceRowIndex = 1;
        const targetRowIndex = 3;

        const waitForNewRowToBeInserted = async () => {
            await waitFor(() => {
                const rows = within(rowgroup).getAllByRole("row");
                expect(rows).toHaveLength(mockTableData.rows.length + 1);
            });
        };

        const rendered = renderTableBlock(mockTableData);
        const rowgroup = rendered.getByRole("rowgroup");

        clickButtonOfRowAtIndex(rendered, sourceRowIndex, /copy/i);
        await waitForClipboardToHaveValue();
        clickButtonOfRowAtIndex(rendered, targetRowIndex, /paste/i);
        await waitForNewRowToBeInserted();

        const rows = within(rowgroup).getAllByRole("row");
        const sourceRowElement = rows[sourceRowIndex];
        const sourceRowCells = within(sourceRowElement).getAllByRole("gridcell");

        const newlyInsertedRowIndex = targetRowIndex + 1;
        const newRowElement = rows[newlyInsertedRowIndex];
        const newRowCells = within(newRowElement).getAllByRole("gridcell");

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

    it("should show an error when pasting invalid data", async () => {
        const rendered = renderTableBlock(mockTableData);

        await navigator.clipboard.writeText("some random invalid data");
        await waitForClipboardToHaveValue();

        clickButtonOfRowAtIndex(rendered, 0, /paste/i);

        const errorAlert = await waitFor(() => rendered.getByRole("alert"));
        expect(errorAlert).not.toBeNull();
        expect(errorAlert.textContent).toContain("Could not paste the clipboard data");
    });

    it("should show an error when pasting an invalid object", async () => {
        const rendered = renderTableBlock(mockTableData);

        const someRandomObject = { foo: "bar", bar: "foo" };
        await navigator.clipboard.writeText(JSON.stringify(someRandomObject));
        await waitForClipboardToHaveValue();

        clickButtonOfRowAtIndex(rendered, 0, /paste/i);

        const errorAlert = await waitFor(() => rendered.getByRole("alert"));
        expect(errorAlert).not.toBeNull();
        expect(errorAlert.textContent).toContain("Could not paste the clipboard data");
    });

    it("should show an error when pasting an empty clipboard", async () => {
        const rendered = renderTableBlock(mockTableData);

        clickButtonOfRowAtIndex(rendered, 0, /paste/i);

        const errorAlert = await waitFor(() => rendered.getByRole("alert"));
        expect(errorAlert).not.toBeNull();
        expect(errorAlert.textContent).toContain("Could not paste the clipboard data");
    });

    // TODO: Fix pasting rows and enable/complete this test
    it.skip("should create new columns when pasting a row with more than existing columns", async () => {
        const rendered = renderTableBlock(mockTableData);
        const rowGroup = rendered.getByRole("rowgroup");

        const pasteBelowRowIndex = 0;

        const numberOfColumnsInMockData = mockTableData.columns.length;
        const numberOfAdditionalColumns = 2;
        const numberOfColumnsInPastingRow = numberOfColumnsInMockData + numberOfAdditionalColumns;

        const newColumnValues = Array.from({ length: numberOfColumnsInPastingRow }).map((_, index) => `Value ${index + 1}`);

        const rowWithMoreColumnsThanInMockData: ClipboardRow = {
            type: "tableBlockRow",
            highlighted: false,
            cellValues: newColumnValues,
        };

        await navigator.clipboard.writeText(JSON.stringify(rowWithMoreColumnsThanInMockData));

        clickButtonOfRowAtIndex(rendered, pasteBelowRowIndex, /paste/i);

        await waitFor(() => {
            const rows = within(rowGroup).getAllByRole("row");
            expect(rows).toHaveLength(mockTableData.rows.length + 1);
        });

        const rows = within(rowGroup).getAllByRole("row");

        rows.forEach((row, rowIndex) => {
            const cellElements = within(row).getAllByRole("gridcell");
            const cellValues = cellElements
                .map((cell) => cell.textContent)
                .filter((_, index) => {
                    const isDragHandleCell = index === 0;
                    const isActionCell = index === cellElements.length - 1;
                    return !isDragHandleCell && !isActionCell;
                });

            expect(cellValues).toHaveLength(numberOfColumnsInPastingRow);

            const isNewlyInsertedRow = rowIndex === pasteBelowRowIndex + 1;

            if (isNewlyInsertedRow) {
                expect(cellValues).toEqual(newColumnValues);
            } else {
                cellValues.forEach((cellValue, cellIndex) => {
                    const isNewlyCreatedColumn = cellIndex >= numberOfColumnsInMockData;
                    if (isNewlyCreatedColumn) {
                        expect(cellValue).toBe("");
                    } else {
                        expect(cellValue).toBe(mockTableData.rows[rowIndex].cellValues[cellIndex].value);
                    }
                });
            }
        });
    });

    // TODO: Fix pasting rows and enable/complete this test
    it.skip("should create empty cells for pasted row if it has less values than existing table columns", async () => {
        const rendered = renderTableBlock(mockTableData);
        const rowGroup = rendered.getByRole("rowgroup");

        const pasteBelowRowIndex = 0;

        const numberOfColumnsInMockData = mockTableData.columns.length;
        const numberOfMissingValues = 2;
        const numberOfValuesInPastingRow = numberOfColumnsInMockData - numberOfMissingValues;

        const newColumnValues = Array.from({ length: numberOfValuesInPastingRow }).map((_, index) => `Value ${index + 1}`);

        const rowWithMoreColumnsThanInMockData: ClipboardRow = {
            type: "tableBlockRow",
            highlighted: false,
            cellValues: newColumnValues,
        };

        await navigator.clipboard.writeText(JSON.stringify(rowWithMoreColumnsThanInMockData));

        clickButtonOfRowAtIndex(rendered, pasteBelowRowIndex, /paste/i);

        await waitFor(() => {
            const rows = within(rowGroup).getAllByRole("row");
            expect(rows).toHaveLength(mockTableData.rows.length + 1);
        });

        const rows = within(rowGroup).getAllByRole("row");

        rows.forEach((row, rowIndex) => {
            const cellElements = within(row).getAllByRole("gridcell");
            const cellValues = cellElements
                .map((cell) => cell.textContent)
                .filter((_, index) => {
                    const isDragHandleCell = index === 0;
                    const isActionCell = index === cellElements.length - 1;
                    return !isDragHandleCell && !isActionCell;
                });

            expect(cellValues).toHaveLength(numberOfValuesInPastingRow);

            const isNewlyInsertedRow = rowIndex === pasteBelowRowIndex + 1;

            if (isNewlyInsertedRow) {
                cellValues.forEach((cellValue, cellIndex) => {
                    const shouldHaveAValue = cellIndex < numberOfValuesInPastingRow;

                    if (shouldHaveAValue) {
                        expect(cellValue).toBe(newColumnValues[cellIndex]);
                    } else {
                        expect(cellValue).toBe("");
                    }
                });
            } else {
                const mockDataRowIndexWithOffsetForNewRow = rowIndex === 0 ? rowIndex : rowIndex - 1;
                expect(cellValues).toEqual(mockTableData.rows[mockDataRowIndexWithOffsetForNewRow].cellValues.map((cellValue) => cellValue.value));
            }
        });
    });
});
