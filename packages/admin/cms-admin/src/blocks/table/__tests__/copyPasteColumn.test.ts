import { userEvent } from "@testing-library/user-event";
import { waitFor } from "test-utils";
import { beforeEach, describe, expect, it } from "vitest";

import { mockBlockDataObjects } from "../__mocks__/TableBlockData.mocks";
import { clickButtonOfColumnAtIndex, getCellValuesPerColumn, renderTableBlock, waitForClipboardToHaveValue } from "./utils";

describe("TableBlock: Copy and paste a column", () => {
    beforeEach(() => {
        // Enable clipboard access in tests
        userEvent.setup();
    });

    it("should copy a certain column and paste it to the right of another column", async () => {
        const sourceColumnIndex = 1;
        const targetColumnIndex = 2;

        const rendered = renderTableBlock(mockBlockDataObjects.default);
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
                expect(newCellValues).toEqual(originalCellValuesPerColumn[columnIndex]);
            }

            if (isPastedColumn || isSourceColumn) {
                expect(newCellValues).toEqual(originalCellValuesPerColumn[sourceColumnIndex]);
            }

            if (isAfterPastedColumn) {
                expect(newCellValues).toEqual(originalCellValuesPerColumn[columnIndex - 1]);
            }
        });
    });
});
