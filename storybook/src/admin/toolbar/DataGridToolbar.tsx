import { DataGridToolbar, GridFilterButton, StackLink, ToolbarActions, ToolbarFillSpace, ToolbarItem } from "@comet/admin";
import { Add as AddIcon } from "@comet/admin-icons";
import { Button } from "@mui/material";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

const data = [
    { id: "1f30a6a0-5b9d-4b25-8307-9e8b4a4d2b1c", firstname: "Emily", lastname: "Smith" },
    { id: "28b9bdf3-5646-4a22-9449-74112db67b5f", firstname: "Daniel", lastname: "Johnson" },
    { id: "e60900ec-3c69-4e67-8d78-83a10c7573d3", firstname: "Sophia", lastname: "Williams" },
];

storiesOf("@comet/admin/DataGridToolbar", module)
    .addDecorator(storyRouterDecorator())
    .add("DataGrid Toolbar", () => {
        const columns = [
            { field: "firstname", headerName: "First Name", width: 150 },
            { field: "lastname", headerName: "Last Name", width: 150 },
        ];

        return (
            <DataGrid
                autoHeight
                columns={columns}
                rows={data}
                components={{
                    Toolbar: () => (
                        <DataGridToolbar>
                            <ToolbarItem>
                                <GridToolbarQuickFilter />
                            </ToolbarItem>
                            <ToolbarItem>
                                <GridFilterButton />
                            </ToolbarItem>
                            <ToolbarFillSpace />
                            <ToolbarActions>
                                <Button
                                    startIcon={<AddIcon />}
                                    component={StackLink}
                                    pageName="add"
                                    payload="add"
                                    variant="contained"
                                    color="primary"
                                >
                                    Add person
                                </Button>
                            </ToolbarActions>
                        </DataGridToolbar>
                    ),
                }}
            />
        );
    });
