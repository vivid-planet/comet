import { userEvent } from "@testing-library/user-event";
import { waitFor, within } from "test-utils";
import { beforeEach, describe, expect, it } from "vitest";

import { mockTableData } from "../__mocks__/TableBlockData.mocks";
import { clickButtonOfRowAtIndex, renderTableBlock } from "./utils";

const waitForClipboardToHaveValue = async () => {
    await waitFor(() => {
        expect(navigator.clipboard.readText()).resolves.not.toBe("");
    });
};

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
});
