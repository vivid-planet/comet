import { Button, DataGridToolbar, FillSpace, FinalForm, Stack, StackMainContent, useEditDialog } from "@comet/admin";
import { Add as AddIcon } from "@comet/admin-icons";
import { DialogContent, TextField } from "@mui/material";
import { DataGrid, type GridToolbarProps } from "@mui/x-data-grid";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { storyRouterDecorator } from "../../story-router.decorator";

export default {
    title: "@comet/admin/edit-dialog",
    decorators: [storyRouterDecorator()],
};

interface ToolbarProps extends GridToolbarProps {
    toolbarAction?: ReactNode;
}

const products = Array.from({ length: 150 }, (_, productIndex) => ({ id: productIndex.toString(), name: `Product ${productIndex + 1}` }));

function Toolbar({ toolbarAction }: ToolbarProps) {
    return (
        <DataGridToolbar>
            <FillSpace />
            {toolbarAction}
        </DataGridToolbar>
    );
}

export const EditDialogInDataGrid = {
    render: () => {
        const intl = useIntl();
        const [EditDialog, , editDialogApi] = useEditDialog();
        console.log(products);

        return (
            <Stack topLevelTitle={intl.formatMessage({ id: "devStories.editDailogBug", defaultMessage: "Edit-Dialog in DataGrid" })}>
                <StackMainContent fullHeight>
                    <DataGrid
                        columns={[
                            { field: "id", headerName: "ID", width: 90 },
                            { field: "name", headerName: "Name", flex: 1 },
                        ]}
                        rows={products}
                        slots={{
                            toolbar: Toolbar,
                        }}
                        slotProps={{
                            toolbar: {
                                toolbarAction: (
                                    <Button responsive startIcon={<AddIcon />} onClick={() => editDialogApi?.openAddDialog()}>
                                        <FormattedMessage id="devStories.editDailogBug.newProduct" defaultMessage="New Product" />
                                    </Button>
                                ),
                            } as ToolbarProps,
                        }}
                    />
                    <EditDialog>
                        <DialogContent>
                            <FinalForm
                                mode="edit"
                                onSubmit={() => {
                                    console.log("Submitted!");
                                }}
                                onAfterSubmit={() => {
                                    editDialogApi.closeDialog();
                                }}
                            >
                                <TextField name="name" label="Name" fullWidth />
                            </FinalForm>
                        </DialogContent>
                    </EditDialog>
                </StackMainContent>
            </Stack>
        );
    },
    name: "EditDialog in DataGrid",
};
