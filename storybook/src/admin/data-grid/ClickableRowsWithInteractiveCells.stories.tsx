import { type GridColDef, StackPage, StackSwitch, Toolbar, ToolbarBackButton, ToolbarTitleItem } from "@comet/admin";
import { Favorite } from "@comet/admin-icons";
import { IconButton, InputBase } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { type StoryObj } from "@storybook/react-webpack5";
import { expect, waitFor, within } from "storybook/test";

import { exampleColumns, exampleRows } from "../../helpers/ExampleDataGrid";
import { stackRouteDecorator } from "../../helpers/storyDecorators";
import { storyRouterDecorator } from "../../story-router.decorator";
import { DummyTextInContentOverflow } from "./utils/DummyTextInContentOverflow";
import { DummyVisibilitySelect } from "./utils/DummyVisibilitySelect";
import { useEditGridRow } from "./utils/useEditGridRow";

export default {
    title: "@comet/admin/data-grid/Clickable Rows With Interactive Cells",
    decorators: [stackRouteDecorator(), storyRouterDecorator()],
};

export const Story = () => {
    // Grid must be a separate component to make sure the stackSwitchApi context is correct
    const Grid = () => {
        const { handleDataGridRowClick, EditIconButton } = useEditGridRow();

        const columns: GridColDef[] = [
            ...exampleColumns,
            {
                field: "input",
                type: "actions",
                headerName: "Input",
                renderCell: () => <InputBase aria-label="Text Input" />,
                flex: 1,
            },
            {
                field: "description",
                type: "actions",
                headerName: "Description",
                renderCell: () => <DummyTextInContentOverflow />,
                flex: 2,
            },
            {
                field: "visible",
                type: "actions",
                headerName: "Visible",
                width: 120,
                renderCell: () => <DummyVisibilitySelect />,
            },
            {
                field: "actions",
                type: "actions",
                headerName: "",
                width: 84,
                renderCell: (params) => (
                    <>
                        <IconButton color="secondary" aria-label="Add to favorites">
                            <Favorite />
                        </IconButton>
                        <EditIconButton id={params.row.id} />
                    </>
                ),
            },
        ];
        return <DataGrid checkboxSelection rows={exampleRows} columns={columns} onRowClick={handleDataGridRowClick} />;
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
            const firstNameCell = within(firstRow).getAllByRole("gridcell")[1];
            const firstName = firstNameCell.textContent;

            const editButton = within(firstRow).getByLabelText(/edit/i);
            await userEvent.click(editButton);

            const toolbarEditText = await within(document.body).findByText(new RegExp(`Editing ${firstName}`));

            expect(toolbarEditText).toBeInTheDocument();
            expect(firstNameCell).not.toBeInTheDocument();
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
            const firstNameCell = within(firstRow).getAllByRole("gridcell")[1];
            const firstName = firstNameCell.textContent;

            await userEvent.click(firstNameCell);

            const toolbarEditText = await within(document.body).findByText(new RegExp(`Editing ${firstName}`));

            expect(toolbarEditText).toBeInTheDocument();
            expect(firstNameCell).not.toBeInTheDocument();
        });
    },
};

export const TestClickingCheckbox: StoryObj<typeof Story> = {
    render: Story,
    play: async ({ canvas, userEvent, step }) => {
        await step("Click on checkbox", async () => {
            const gridRowsContainer = canvas.getByRole("rowgroup");
            const firstRow = within(gridRowsContainer).getAllByRole("row")[0];

            const inputTypeCheckbox = within(firstRow).getByRole("checkbox");
            await userEvent.click(inputTypeCheckbox);

            expect(firstRow).toBeInTheDocument();
            expect(inputTypeCheckbox).toBeChecked();

            const toolbarEditText = within(document.body).queryByText(new RegExp(`Editing`));
            expect(toolbarEditText).toBeNull();
        });
    },
};

export const TestClickingFavoriteButton: StoryObj<typeof Story> = {
    render: Story,
    play: async ({ canvas, userEvent, step }) => {
        await step("Click on favorite button", async () => {
            const gridRowsContainer = canvas.getByRole("rowgroup");
            const firstRow = within(gridRowsContainer).getAllByRole("row")[0];

            const favoriteButton = within(firstRow).getByLabelText(/add to favorites/i);
            await userEvent.click(favoriteButton);

            expect(firstRow).toBeInTheDocument();

            const toolbarEditText = within(document.body).queryByText(new RegExp(`Editing`));
            expect(toolbarEditText).toBeNull();
        });
    },
};

export const TestSettingInvisible: StoryObj<typeof Story> = {
    render: Story,
    play: async ({ canvas, userEvent, step }) => {
        const gridRowsContainer = canvas.getByRole("rowgroup");
        const firstRow = within(gridRowsContainer).getAllByRole("row")[0];
        const selectVisibilityButton = within(firstRow).getByLabelText(/select visibility/i);

        await step("Open visibility menu", async () => {
            await userEvent.click(selectVisibilityButton);

            expect(firstRow).toBeInTheDocument();
            const toolbarEditText = within(document.body).queryByText(new RegExp(`Editing`));
            expect(toolbarEditText).toBeNull();
        });
        await step("Click on invisible option", async () => {
            const menu = await waitFor(() => within(document.body).getByRole("menu"), { timeout: 4000 });
            const invisibleOption = within(menu).getByText(/invisible/i);
            await userEvent.click(invisibleOption);

            expect(firstRow).toBeInTheDocument();
            expect(selectVisibilityButton).toHaveTextContent(/invisible/i);
            const toolbarEditText = within(document.body).queryByText(new RegExp(`Editing`));
            expect(toolbarEditText).toBeNull();
        });
    },
};

export const TestOpeningContentOverflow: StoryObj<typeof Story> = {
    render: Story,
    play: async ({ canvas, userEvent, step }) => {
        const startTextOfContentOverflow = "Ornare Inceptos Egestas Bibendum";

        await step("Open visibility menu", async () => {
            const gridRowsContainer = canvas.getByRole("rowgroup");
            const firstRow = within(gridRowsContainer).getAllByRole("row")[0];

            const buttonsInRow = within(firstRow).getAllByRole("button");
            const descriptionButton = buttonsInRow.find((button) => button.textContent?.includes(startTextOfContentOverflow));

            if (!descriptionButton) {
                throw new Error("Description button not found in row");
            }

            await userEvent.click(descriptionButton);

            expect(firstRow).toBeInTheDocument();
            const toolbarEditText = within(document.body).queryByText(new RegExp(`Editing`));
            expect(toolbarEditText).toBeNull();

            const dialog = await waitFor(() => within(document.body).getByRole("dialog"), { timeout: 4000 });
            expect(dialog).toBeInTheDocument();

            const dialogTitleText = within(dialog).queryByText(new RegExp(`${startTextOfContentOverflow}`));
            expect(dialogTitleText).toBeInTheDocument();
        });
    },
};

export const TestInteractingWithInput: StoryObj<typeof Story> = {
    render: Story,
    play: async ({ canvas, userEvent, step }) => {
        const gridRowsContainer = canvas.getByRole("rowgroup");
        const firstRow = within(gridRowsContainer).getAllByRole("row")[0];
        const inputWrapper = within(firstRow).getByLabelText(/text input/i);
        const input = within(inputWrapper).getByRole("textbox");

        await step("Click on input", async () => {
            await userEvent.click(inputWrapper);
            expect(input).toHaveFocus();
            expect(firstRow).toBeInTheDocument();

            const toolbarEditText = within(document.body).queryByText(new RegExp(`Editing`));
            expect(toolbarEditText).toBeNull();
        });
        await step("Type in input", async () => {
            await userEvent.type(input, "Hello");
            expect(input).toHaveValue("Hello");
            expect(firstRow).toBeInTheDocument();

            const toolbarEditText = within(document.body).queryByText(new RegExp(`Editing`));
            expect(toolbarEditText).toBeNull();
        });
    },
};
