import {
    Button,
    DataGridToolbar,
    FillSpace,
    GridColumnsButton,
    GridFilterButton,
    StackLink,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Add as AddIcon } from "@comet/admin-icons";
import { DataGrid as DataGridCommunity, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { DataGridPro } from "@mui/x-data-grid-pro";

import { storyRouterDecorator } from "../../story-router.decorator";

const data = [
    { id: "1f30a6a0-5b9d-4b25-8307-9e8b4a4d2b1c", firstname: "Emily", lastname: "Smith" },
    { id: "28b9bdf3-5646-4a22-9449-74112db67b5f", firstname: "Daniel", lastname: "Johnson" },
    { id: "e60900ec-3c69-4e67-8d78-83a10c7573d3", firstname: "Sophia", lastname: "Williams" },
];

const gridOptions = ["Community", "Pro"] as const;

export default {
    title: "@comet/admin/DataGridToolbar",
    decorators: [storyRouterDecorator()],
    argTypes: {
        gridVersion: {
            name: "Data Grid Version",
            control: "select",
            options: gridOptions,
        },
    },
    args: { gridVersion: gridOptions[0] },
};

export const _DataGridToolbar = {
    render: ({ gridVersion }: { gridVersion: (typeof gridOptions)[number] }) => {
        const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("FooBar") };

        const columns = [
            { field: "firstname", headerName: "First Name", width: 150 },
            { field: "lastname", headerName: "Last Name", width: 150 },
        ];

        const Toolbar = () => {
            return (
                <DataGridToolbar>
                    <GridToolbarQuickFilter />
                    <GridFilterButton />
                    <GridColumnsButton />
                    <FillSpace />
                    <Button responsive startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add">
                        Add person
                    </Button>
                </DataGridToolbar>
            );
        };

        const DataGrid = gridVersion === "Community" ? DataGridCommunity : DataGridPro;

        return (
            <DataGrid
                {...dataGridProps}
                autoHeight
                columns={columns}
                rows={data}
                slots={{
                    toolbar: Toolbar,
                }}
            />
        );
    },

    name: "DataGrid Toolbar",
};
