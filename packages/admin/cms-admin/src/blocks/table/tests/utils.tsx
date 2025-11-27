import { type RenderResult, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";

import { type TableBlockData } from "../../../blocks.generated";
import { render } from "../../../testing/test-utils";
import { TableBlockGrid } from "../TableBlockGrid";
import { exampleTableBlockData } from "./exampleTableBlockData";

export type CellValue = string | null;

export const getRenderedTableBlock = () => {
    const Component = () => {
        const [state, setState] = useState<TableBlockData>(exampleTableBlockData);
        return (
            <>
                <div data-testid="table-block-state" data-state={JSON.stringify(state)} />
                <TableBlockGrid state={state} updateState={setState} />
            </>
        );
    };

    const rendered = render(<Component />);
    return rendered;
};

export const getCellValuesForAllRows = (rendered: RenderResult) => {
    const valuesPerRow: CellValue[][] = [];
    const rows = rendered.getAllByTestId("table-block-grid-row");

    rows.forEach((row) => {
        const cells = within(row).getAllByTestId("table-block-grid-cell-value");
        valuesPerRow.push(cells.map((cell) => cell.textContent));
    });

    return valuesPerRow;
};

export const openActionsMenuOfRowAtIndex = async (rendered: RenderResult, rowIndex: number) => {
    const row = rendered.getAllByTestId("table-block-grid-row")[rowIndex];
    const openMenuButton = within(row).getByTestId("table-block-actions-cell-open-row-actions-menu-button");
    await userEvent.click(openMenuButton);
};

export const clickInsertRowAboveButton = async (rendered: RenderResult) => {
    const addRowAboveButton = rendered.getByTestId("table-block-actions-cell-add-row-above-button");
    await userEvent.click(addRowAboveButton);
};

export const clickInsertRowBelowButton = async (rendered: RenderResult) => {
    const addRowBelowButton = rendered.getByTestId("table-block-actions-cell-add-row-below-button");
    await userEvent.click(addRowBelowButton);
};

export const expectValidUniqueIdsInState = (rendered: RenderResult) => {
    const state = JSON.parse(rendered.getByTestId("table-block-state").getAttribute("data-state") ?? "{}") as TableBlockData;
    const newRowIds = state.rows.map((row) => row.id);
    const newColumnIds = state.columns.map((col) => col.id);

    for (const rowId of newRowIds) {
        expect(typeof rowId).toBe("string");
        expect(rowId.length).toBeGreaterThan(0);
    }

    for (const columnId of newColumnIds) {
        expect(typeof columnId).toBe("string");
        expect(columnId.length).toBeGreaterThan(0);
    }

    expect(new Set(newRowIds).size).toBe(newRowIds.length);
    expect(new Set(newColumnIds).size).toBe(newColumnIds.length);
};
