import { fireEvent } from "@testing-library/dom";
import { within } from "test-utils";
import { describe, it } from "vitest";

import { mockTableData } from "../__mocks__/TableBlockData.mocks";
import { renderTableBlock } from "./utils";

const dragAndDrop = async (sourceElement: HTMLElement, targetElement: HTMLElement) => {
    fireEvent.mouseDown(sourceElement);
    await new Promise((resolve) => setTimeout(resolve, 500));
    fireEvent.mouseMove(targetElement, { clientX: 10, clientY: 10 });
    await new Promise((resolve) => setTimeout(resolve, 500));
    fireEvent.mouseUp(targetElement);
    await new Promise((resolve) => setTimeout(resolve, 500));
};

describe("TableBlock: Drag and drop a column", () => {
    it("should move column at index 1 to index 3", async () => {
        const sourceColumnIndex = 1;
        const targetColumnIndex = 3;

        const rendered = renderTableBlock(mockTableData);
        const columnHeaders = rendered.getAllByRole("columnheader");

        const rowgroup = rendered.getByRole("rowgroup");
        const rows = within(rowgroup).getAllByRole("row");

        const originalCellValuesPerRow = rows.map((row) => {
            return within(row)
                .getAllByRole("gridcell")
                .map((cell) => cell.textContent);
        });

        const sourceColumnDragHandle = within(columnHeaders[sourceColumnIndex]).getByLabelText(/drag to reorder column/i);
        const targetColumnHeader = columnHeaders[targetColumnIndex];
        await dragAndDrop(sourceColumnDragHandle, targetColumnHeader);

        // TODO: remove
        const updatedCellValuesPerRow = rows.map((row) => {
            return within(row)
                .getAllByRole("gridcell")
                .map((cell) => cell.textContent);
        });

        // eslint-disable-next-line no-console
        console.log("### first row:", {
            from: originalCellValuesPerRow[0].join(" | "),
            __to: updatedCellValuesPerRow[0].join(" | "),
        });

        // const rowgroup2 = rendered.getByRole("rowgroup");
        // const rows2 = within(rowgroup2).getAllByRole("row");
        // rows2.forEach((row, rowIndex) => {
        //     const originalSourceCellValue = originalCellValuesPerRow[rowIndex][sourceColumnIndex];
        //     const originalTargetCellValue = originalCellValuesPerRow[rowIndex][targetColumnIndex];

        //     const updatedSourceCellValue = within(row).getAllByRole("gridcell")[sourceColumnIndex].textContent;
        //     const updatedTargetCellValue = within(row).getAllByRole("gridcell")[targetColumnIndex].textContent;

        //     console.log("### updated source:", { from: originalSourceCellValue, to: updatedSourceCellValue });
        //     console.log("### updated target:", { from: originalTargetCellValue, to: updatedTargetCellValue });

        //     expect(updatedSourceCellValue).not.toBe(originalSourceCellValue);
        //     expect(updatedTargetCellValue).toBe(originalTargetCellValue);
        // });
    });
});
