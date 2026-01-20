import { useState } from "react";
import { fireEvent, render, type RenderResult, waitFor, within } from "test-utils";
import { expect } from "vitest";

import { type TableBlockData } from "../../../blocks.generated";
import { TableBlockGrid } from "../TableBlockGrid";

export const renderTableBlock = (initialState: TableBlockData) => {
    const Component = () => {
        const [state, setState] = useState<TableBlockData>(initialState);
        return <TableBlockGrid state={state} updateState={setState} />;
    };
    return render(<Component />);
};

export const clickButtonOfRowAtIndex = (rendered: RenderResult, index: number, buttonNameRegex: RegExp) => {
    const rowOptionsButtons = rendered.getAllByLabelText(/row options/i);
    const rowOptionsButton = rowOptionsButtons[index];
    fireEvent.click(rowOptionsButton);

    const button = rendered.getByRole("menuitem", { name: buttonNameRegex });
    fireEvent.click(button);
};

export const clickButtonOfColumnAtIndex = (rendered: RenderResult, index: number, buttonNameRegex: RegExp) => {
    const columnOptionsButtons = rendered.getAllByLabelText(/column options/i);
    const columnOptionsButton = columnOptionsButtons[index];
    fireEvent.click(columnOptionsButton);

    const button = rendered.getByRole("menuitem", { name: buttonNameRegex });
    fireEvent.click(button);
};

export const waitForClipboardToHaveValue = async () => {
    await waitFor(async () => {
        await expect(navigator.clipboard.readText()).resolves.not.toBe("");
    });
};

export const getCellValuesPerColumn = (rendered: RenderResult) => {
    const rowgroup = rendered.getByRole("rowgroup");
    const rows = within(rowgroup).getAllByRole("row");

    const rowCells = rows.map((row) => within(row).getAllByRole("gridcell"));
    const firstRowCells = rowCells[0];
    const cellValuesPerColumn: string[][] = [];

    firstRowCells.forEach((_, cellIndex) => {
        const isDragHandleCell = cellIndex === 0;
        const isActionsCell = cellIndex === firstRowCells.length - 1;
        if (isDragHandleCell || isActionsCell) {
            return;
        }

        const cellValuesOfColumn: string[] = [];

        rowCells.forEach((rowCells) => {
            cellValuesOfColumn.push(rowCells[cellIndex].textContent);
        });

        cellValuesPerColumn.push(cellValuesOfColumn);
    });

    return cellValuesPerColumn;
};

export const getCellsExcludingTheDragHandleAndActionsCells = (rowElement: HTMLElement): HTMLElement[] => {
    return within(rowElement).queryAllByRole("gridcell").slice(1, -1);
};
