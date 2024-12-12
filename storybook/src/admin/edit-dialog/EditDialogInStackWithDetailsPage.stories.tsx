import {
    Field,
    FinalForm,
    FinalFormInput,
    messages,
    SaveBoundary,
    Stack,
    StackBreadcrumbs,
    StackLink,
    StackMainContent,
    StackPage,
    StackSwitch,
    StackToolbar,
    ToolbarFillSpace,
    ToolbarItem,
    ToolbarTitleItem,
    useEditDialog,
} from "@comet/admin";
import { Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { editDialogDecorator } from "../../docs/components/EditDialog/editDialog.decorator";

export default {
    title: "@comet/admin/edit-dialog",
    decorators: [editDialogDecorator()],
};

// TODO Project behaviour not reproducible

export const EditDialogInStackWithDetailsPage = {
    render: () => {
        const [EditDialog, , editDialogApi] = useEditDialog();

        const products = [
            { id: "1", name: "Product 1" },
            { id: "2", name: "Product 2" },
            { id: "3", name: "Product 3" },
            { id: "4", name: "Product 4" },
            { id: "5", name: "Product 5" },
        ];

        return (
            <>
                <Stack topLevelTitle="Products">
                    <StackBreadcrumbs />
                    <StackSwitch initialPage="grid">
                        <StackPage name="grid">
                            <StackToolbar>
                                <ToolbarTitleItem>
                                    Click on Details to see the details of a DataGrid entry. In a project, the EditDialog gets opened instead. Here,
                                    the behaviour is correct. Why?
                                </ToolbarTitleItem>
                                <ToolbarFillSpace />
                                <ToolbarItem>
                                    <Button onClick={() => editDialogApi.openAddDialog()} variant="contained" color="primary">
                                        <FormattedMessage {...messages.add} />
                                    </Button>
                                </ToolbarItem>
                            </StackToolbar>
                            <StackMainContent fullHeight disablePadding>
                                <DataGrid
                                    columns={[
                                        { field: "id", headerName: "ID", width: 90 },
                                        { field: "name", headerName: "Name", flex: 1 },
                                        {
                                            field: "actions",
                                            headerName: "",
                                            renderCell: ({ row }) => (
                                                <StackLink pageName="details" payload={row.id}>
                                                    Details
                                                </StackLink>
                                            ),
                                        },
                                    ]}
                                    rows={products}
                                />
                            </StackMainContent>
                        </StackPage>
                        <StackPage name="details" title="Details of product">
                            {(productId) => (
                                <SaveBoundary>
                                    <StackMainContent fullHeight disablePadding>
                                        <Typography variant="h6" py={2}>
                                            Stack selection ID: {productId}
                                        </Typography>
                                    </StackMainContent>
                                </SaveBoundary>
                            )}
                        </StackPage>
                    </StackSwitch>
                </Stack>

                <EditDialog>
                    <FinalForm
                        mode="add"
                        onSubmit={async ({ name }) => {
                            window.alert(`Name: ${name}`);
                        }}
                    >
                        <Field label="Name" name="name" component={FinalFormInput} fullWidth autoFocus required />
                    </FinalForm>
                </EditDialog>
            </>
        );
    },
    name: "EditDialog in Stack with details page",
};
