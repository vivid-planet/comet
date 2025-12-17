import { type GridColDef, StackLink, StackPage, StackSwitch, Toolbar, ToolbarBackButton, ToolbarTitleItem, useStackSwitchApi } from "@comet/admin";
import { Edit } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { exampleColumns, exampleRows } from "../../helpers/ExampleDataGrid";
import { stackRouteDecorator } from "../../helpers/storyDecorators";
import { storyRouterDecorator } from "../../story-router.decorator";

export default {
    title: "@comet/admin/data-grid",
    decorators: [stackRouteDecorator(), storyRouterDecorator()],
};

export const ClickableRows = () => {
    // Grid must be a separate component to make sure the stackSwitchApi context is correct
    const Grid = () => {
        const stackSwitchApi = useStackSwitchApi();

        const columns: GridColDef[] = [
            ...exampleColumns,
            {
                field: "actions",
                type: "actions",
                headerName: "",
                width: 52,
                renderCell: (params) => (
                    <IconButton color="primary" component={StackLink} pageName="edit" payload={params.row.id}>
                        <Edit />
                    </IconButton>
                ),
            },
        ];

        return (
            <DataGrid
                rows={exampleRows}
                columns={columns}
                onRowClick={(params) => {
                    stackSwitchApi.activatePage("edit", params.row.id);
                }}
            />
        );
    };

    return (
        <StackSwitch>
            <StackPage name="grid">
                <Grid />
            </StackPage>
            <StackPage name="edit">
                {(id) => (
                    <Toolbar>
                        <ToolbarBackButton />
                        <ToolbarTitleItem>
                            Editing item with id: <code>{id}</code>
                        </ToolbarTitleItem>
                    </Toolbar>
                )}
            </StackPage>
        </StackSwitch>
    );
};
