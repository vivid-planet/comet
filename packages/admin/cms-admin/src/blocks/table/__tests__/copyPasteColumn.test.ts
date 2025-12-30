import { userEvent } from "@testing-library/user-event";
import { type RenderResult, waitFor, within } from "test-utils";
import { beforeEach, describe, expect, it } from "vitest";

import { mockTableData } from "../__mocks__/TableBlockData.mocks";
import { clickButtonOfColumnAtIndex, renderTableBlock, waitForClipboardToHaveValue } from "./utils";

const getCellValuesPerColumn = (rendered: RenderResult) => {
    const rowgroup = rendered.getByRole("rowgroup");
    const rows = within(rowgroup).getAllByRole("row");

    const firstRowCells = within(rows[0]).getAllByRole("gridcell");
    const cellValuesPerColumn: string[][] = [];

    firstRowCells.forEach((_, cellIndex) => {
        const isDragHandleCell = cellIndex === 0;
        const isActionsCell = cellIndex === firstRowCells.length - 1;
        if (isDragHandleCell || isActionsCell) {
            return;
        }

        const cellValuesOfColumn: string[] = [];

        rows.forEach((row) => {
            const rowCells = within(row).getAllByRole("gridcell");
            cellValuesOfColumn.push(rowCells[cellIndex].textContent);
        });

        cellValuesPerColumn.push(cellValuesOfColumn);
    });

    return cellValuesPerColumn;
};

describe("TableBlock: Copy and paste a column", () => {
    beforeEach(() => {
        // Enable clipboard access in tests
        userEvent.setup();
    });

    it("should copy a certain column and paste it to the right of another column", async () => {
        const sourceColumnIndex = 1;
        const targetColumnIndex = 2;

        const rendered = renderTableBlock(mockTableData);
        const initialColumnHeaders = rendered.getAllByRole("columnheader");

        const waitForNewColumnToBeInserted = async () => {
            await waitFor(() => {
                const currentColumnHeaders = rendered.getAllByRole("columnheader");
                expect(currentColumnHeaders).toHaveLength(initialColumnHeaders.length + 1);
            });
        };

        const originalCellValuesPerColumn = getCellValuesPerColumn(rendered);

        clickButtonOfColumnAtIndex(rendered, sourceColumnIndex, /copy/i);
        await waitForClipboardToHaveValue();
        clickButtonOfColumnAtIndex(rendered, targetColumnIndex, /paste/i);
        await waitForNewColumnToBeInserted();

        const newCellValuesPerColumn = getCellValuesPerColumn(rendered);

        newCellValuesPerColumn.forEach((newCellValues, columnIndex) => {
            const isSourceColumn = columnIndex === sourceColumnIndex;
            const isBeforePastedColumn = columnIndex < targetColumnIndex + 1;
            const isPastedColumn = columnIndex === targetColumnIndex + 1;
            const isAfterPastedColumn = columnIndex > targetColumnIndex + 1;

            if (isBeforePastedColumn) {
                expect(newCellValues).toStrictEqual(originalCellValuesPerColumn[columnIndex]);
            }

            if (isPastedColumn || isSourceColumn) {
                expect(newCellValues).toStrictEqual(originalCellValuesPerColumn[sourceColumnIndex]);
            }

            if (isAfterPastedColumn) {
                expect(newCellValues).toStrictEqual(originalCellValuesPerColumn[columnIndex - 1]);
            }
        });
    });
});
