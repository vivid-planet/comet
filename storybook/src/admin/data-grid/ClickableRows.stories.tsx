import { type GridColDef, StackPage, StackSwitch, Toolbar, ToolbarBackButton, ToolbarTitleItem } from "@comet/admin";
import { DataGrid } from "@mui/x-data-grid";
import { type StoryObj } from "@storybook/react-webpack5";
import { expect, within } from "storybook/test";

import { exampleColumns, exampleRows } from "../../helpers/ExampleDataGrid";
import { stackRouteDecorator } from "../../helpers/storyDecorators";
import { storyRouterDecorator } from "../../story-router.decorator";
import { useEditGridRow } from "./utils/useEditGridRow";

export default {
    title: "@comet/admin/data-grid/Clickable Rows",
    decorators: [stackRouteDecorator(), storyRouterDecorator()],
};

export const Story = () => {
    // Grid must be a separate component to make sure the stackSwitchApi context is correct
    const Grid = () => {
        const { handleDataGridRowClick, actionsCell } = useEditGridRow();
        const columns: GridColDef[] = [...exampleColumns, actionsCell];
        return <DataGrid rows={exampleRows} columns={columns} onRowClick={handleDataGridRowClick} />;
    };

    return (
        <StackSwitch>
            <StackPage name="grid">
                <Grid />
            </StackPage>
            <StackPage name="edit">
                {(id) => {
                    const row = exampleRows.find((row) => row.id.toString() === id);
                    if (!row) return null;

                    return (
                        <Toolbar>
                            <ToolbarBackButton />
                            <ToolbarTitleItem>
                                Editing {row.firstName} {row.lastName} (ID: {id})
                            </ToolbarTitleItem>
                        </Toolbar>
                    );
                }}
            </StackPage>
        </StackSwitch>
    );
};

export const TestClickingEditButton: StoryObj<typeof Story> = {
    render: Story,
    play: async ({ canvas, userEvent, step }) => {
        await step("Click on edit button", async () => {
            const gridRowsContainer = canvas.getByRole("rowgroup");
            const firstRow = within(gridRowsContainer).getAllByRole("row")[0];
            const firstCell = within(firstRow).getAllByRole("gridcell")[0];
            const firstName = firstCell.textContent;

            const editButton = within(firstRow).getByLabelText(/edit/i);
            await userEvent.click(editButton);

            const editText = await within(document.body).findByText(new RegExp(`Editing ${firstName}`));

            expect(editText).toBeInTheDocument();
            expect(firstCell).not.toBeInTheDocument();
            expect(editButton).not.toBeInTheDocument();
        });
    },
};

export const TestClickingRow: StoryObj<typeof Story> = {
    render: Story,
    play: async ({ canvas, userEvent, step }) => {
        await step("Click on row (first cell)", async () => {
            const gridRowsContainer = canvas.getByRole("rowgroup");
            const firstRow = within(gridRowsContainer).getAllByRole("row")[0];
            const firstCell = within(firstRow).getAllByRole("gridcell")[0];
            const firstName = firstCell.textContent;

            await userEvent.click(firstCell);

            const editText = await within(document.body).findByText(new RegExp(`Editing ${firstName}`));

            expect(editText).toBeInTheDocument();
            expect(firstCell).not.toBeInTheDocument();
        });
    },
};
