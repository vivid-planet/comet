import { DataGridToolbar, FillSpace, ToolbarActions, ToolbarTitleItem } from "@comet/admin";
import { Add } from "@comet/admin-icons";
import { Box, Button } from "@mui/material";
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
                // TODO: Use "density" directly once "compact" is supported: https://vivid-planet.atlassian.net/browse/COM-1504
                <DataGridToolbar density={density === "compact" ? "standard" : density}>
                    <ToolbarTitleItem>DataGrid example</ToolbarTitleItem>
                    <FillSpace />
                    <ToolbarActions>
                        <Button variant="contained" startIcon={<Add />}>
                            Add
                        </Button>
                    </ToolbarActions>
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
