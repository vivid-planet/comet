<<<<<<< HEAD
import { DataGridToolbar, FillSpace, ToolbarTitleItem } from "@comet/admin";
=======
import { Button, DataGridToolbar, FillSpace, ToolbarActions, ToolbarTitleItem } from "@comet/admin";
>>>>>>> main
import { Add } from "@comet/admin-icons";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { exampleColumns, exampleRows } from "../../helpers/ExampleDataGrid";

export default {
    title: "@comet/admin/mui/DataGrid",
};

type DefaultArgs = {
    density: "standard" | "comfortable" | "compact";
};

export const Default = {
    args: {
        density: "standard",
    },
    argTypes: {
        density: {
            name: "Density",
            control: "select",
            options: ["standard", "comfortable", "compact"],
        },
    },
    render: ({ density }: DefaultArgs) => {
        const ToolbarForGrid = () => {
            return (
                <DataGridToolbar>
                    <ToolbarTitleItem>DataGrid example</ToolbarTitleItem>
                    <FillSpace />
<<<<<<< HEAD
                    <Button variant="contained" startIcon={<Add />}>
                        Add
                    </Button>
=======
                    <ToolbarActions>
                        <Button startIcon={<Add />}>Add</Button>
                    </ToolbarActions>
>>>>>>> main
                </DataGridToolbar>
            );
        };

        return (
            <Box height={400}>
                <DataGrid
                    density={density}
                    rows={exampleRows}
                    columns={exampleColumns}
                    slots={{
                        toolbar: ToolbarForGrid,
                    }}
                />
            </Box>
        );
    },
};
