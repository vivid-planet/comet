import { DataGridToolbar, ToolbarActions, ToolbarFillSpace, ToolbarTitleItem } from "@comet/admin";
import { Add } from "@comet/admin-icons";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { exampleColumns, exampleRows } from "../../../helpers/ExampleDataGrid";

export default {
    title: "@comet/admin/mui/DataGrid/Density",
};

export const Standard = {
    render: () => {
        const ToolBarForGrid = () => {
            return (
                <DataGridToolbar density="standard">
                    <ToolbarTitleItem>Standard density</ToolbarTitleItem>
                    <ToolbarFillSpace />
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
                    density="standard"
                    rows={exampleRows}
                    columns={exampleColumns}
                    components={{
                        Toolbar: ToolBarForGrid,
                    }}
                />
            </Box>
        );
    },
};

export const Comfortable = {
    render: () => {
        const ToolBarForGrid = () => {
            return (
                <DataGridToolbar density="comfortable">
                    <ToolbarTitleItem>Comfortable density</ToolbarTitleItem>
                    <ToolbarFillSpace />
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
                    density="comfortable"
                    rows={exampleRows}
                    columns={exampleColumns}
                    components={{
                        Toolbar: ToolBarForGrid,
                    }}
                />
            </Box>
        );
    },
};

export const Compact = {
    render: () => {
        const ToolBarForGrid = () => {
            return (
                <DataGridToolbar
                    density="standard" // TODO: 'compact' density is not supported yet
                >
                    <ToolbarTitleItem>Compact density</ToolbarTitleItem>
                    <ToolbarFillSpace />
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
                    density="compact"
                    rows={exampleRows}
                    columns={exampleColumns}
                    components={{
                        Toolbar: ToolBarForGrid,
                    }}
                />
            </Box>
        );
    },
};
