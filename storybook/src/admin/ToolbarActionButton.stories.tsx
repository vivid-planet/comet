import { DataGridToolbar, ToolbarActionButton, ToolbarActions, ToolbarFillSpace, ToolbarTitleItem } from "@comet/admin";
import { Add } from "@comet/admin-icons";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

import { exampleColumns, exampleRows } from "../helpers/ExampleDataGrid";

export default {
    title: "@comet/admin/ToolbarActionButton",
};

export const Default = {
    render: () => {
        const ExampleToolbar = () => (
            <DataGridToolbar>
                <ToolbarTitleItem>Example</ToolbarTitleItem>
                <ToolbarFillSpace />
                <ToolbarActions>
                    <ToolbarActionButton
                        startIcon={<Add />}
                        variant="contained"
                        onClick={() => {
                            // noop
                        }}
                    >
                        This is just a button
                    </ToolbarActionButton>
                    <ToolbarActionButton
                        startIcon={<Add />}
                        onClick={() => {
                            return new Promise((resolve) => setTimeout(resolve, 500));
                        }}
                        // TODO: Make this work just like the FeedbackButton
                        // tooltipErrorMessage="This failed but at least it has a custom message"
                        // tooltipSuccessMessage="This worked and has a custom message"
                    >
                        This will fail
                    </ToolbarActionButton>
                    <ToolbarActionButton
                        startIcon={<Add />}
                        onClick={() => {
                            return new Promise((_, reject) => setTimeout(reject, 500));
                        }}
                        // TODO: Make this work just like the FeedbackButton
                        // tooltipErrorMessage="This failed but at least it has a custom message"
                        // tooltipSuccessMessage="This worked and has a custom message"
                    >
                        This will succeed
                    </ToolbarActionButton>
                </ToolbarActions>
            </DataGridToolbar>
        );

        return (
            <Box height={400}>
                <DataGrid
                    rows={exampleRows}
                    columns={exampleColumns}
                    components={{
                        Toolbar: ExampleToolbar,
                    }}
                />
            </Box>
        );
    },
};
