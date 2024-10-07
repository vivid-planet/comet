import { FinalForm, MainContent, Stack, StackBreadcrumbs, StackLink, StackPage, StackSwitch, TextField, useEditDialog } from "@comet/admin";
import { Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { storiesOf } from "@storybook/react";
import React from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

const products = [
    { id: "1", name: "Product 1" },
    { id: "2", name: "Product 2" },
    { id: "3", name: "Product 3" },
    { id: "4", name: "Product 4" },
    { id: "5", name: "Product 5" },
];

function ProductDetail({ id: stackSelectionId }: { id: string }) {
    const [EditDialog, { id: editDialogSelectionId }, editDialogApi] = useEditDialog();

    return (
        <>
            <MainContent fullHeight disablePadding>
                <Typography variant="h6" py={2}>
                    Stack selection ID: {stackSelectionId}
                </Typography>
                <DataGrid
                    columns={[
                        { field: "id", headerName: "ID", width: 90 },
                        { field: "name", headerName: "Name", flex: 1 },
                        {
                            field: "actions",
                            headerName: "",
                            renderCell: ({ row }) => (
                                <Button
                                    onClick={() => {
                                        editDialogApi.openEditDialog(row.id);
                                    }}
                                >
                                    Edit
                                </Button>
                            ),
                        },
                    ]}
                    rows={products}
                />
            </MainContent>
            <EditDialog>
                <Typography variant="h6" py={2}>
                    EditDialog selection ID: {editDialogSelectionId}
                </Typography>
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
            </EditDialog>
        </>
    );
}

storiesOf("@comet/admin/edit-dialog", module)
    .addDecorator(storyRouterDecorator())
    .add("Nested Edit Dialog in Stack", function Story() {
        return (
            <Stack topLevelTitle="Products">
                <StackBreadcrumbs />
                <StackSwitch initialPage="grid">
                    <StackPage name="grid">
                        <MainContent fullHeight disablePadding>
                            <DataGrid
                                columns={[
                                    { field: "id", headerName: "ID", width: 90 },
                                    { field: "name", headerName: "Name", flex: 1 },
                                    {
                                        field: "actions",
                                        headerName: "",
                                        renderCell: ({ row }) => (
                                            <StackLink pageName="detail" payload={row.id}>
                                                Edit
                                            </StackLink>
                                        ),
                                    },
                                ]}
                                rows={products}
                            />
                        </MainContent>
                    </StackPage>
                    <StackPage name="detail" title="Edit product detail">
                        {(productId) => <ProductDetail id={productId} />}
                    </StackPage>
                </StackSwitch>
            </Stack>
        );
    });
