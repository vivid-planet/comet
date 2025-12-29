import { useState } from "react";
import { fireEvent, render, type RenderResult } from "test-utils";

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
