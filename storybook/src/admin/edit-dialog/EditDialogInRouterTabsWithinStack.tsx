import {
    DataGridToolbar,
    EditDialog,
    FinalForm,
    IEditDialogApi,
    MainContent,
    messages,
    RouterTab,
    RouterTabs,
    SaveBoundary,
    SaveBoundarySaveButton,
    Stack,
    StackLink,
    StackPage,
    StackSwitch,
    StackToolbar,
    TextField,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
    ToolbarFillSpace,
    ToolbarItem,
} from "@comet/admin";
import { Add, Edit } from "@comet/admin-icons";
import { Button, IconButton, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { storiesOf } from "@storybook/react";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { storyRouterDecorator } from "../../story-router.decorator";

const products = [
    { id: "0", name: "Product 1" },
    { id: "1", name: "Product 2" },
    { id: "2", name: "Product 3" },
    { id: "3", name: "Product 4" },
    { id: "4", name: "Product 5" },
];

const stocks = [
    { id: "0", productId: "0", amount: "1" },
    { id: "1", productId: "0", amount: "1" },
    { id: "2", productId: "0", amount: "1" },
    { id: "3", productId: "1", amount: "1" },
    { id: "4", productId: "1", amount: "1" },
    { id: "5", productId: "1", amount: "2" },
    { id: "6", productId: "1", amount: "2" },
    { id: "7", productId: "2", amount: "2" },
    { id: "8", productId: "2", amount: "2" },
    { id: "9", productId: "2", amount: "3" },
    { id: "10", productId: "3", amount: "3" },
    { id: "11", productId: "3", amount: "3" },
    { id: "12", productId: "3", amount: "3" },
    { id: "13", productId: "4", amount: "4" },
    { id: "14", productId: "4", amount: "4" },
    { id: "15", productId: "4", amount: "4" },
    { id: "16", productId: "4", amount: "4" },
    { id: "17", productId: "5", amount: "5" },
    { id: "18", productId: "5", amount: "5" },
    { id: "19", productId: "5", amount: "5" },
    { id: "20", productId: "5", amount: "5" },
];

type DialogProps = {
    dialogApiRef: React.RefObject<IEditDialogApi>;
};

const AddProductDialog: React.FC<DialogProps> = ({ dialogApiRef }) => {
    const intl = useIntl();

    return (
        <EditDialog
            ref={dialogApiRef}
            title={intl.formatMessage({ id: "addProductDialog.title", defaultMessage: "Add a new Product" })}
            componentsProps={{ dialog: { scroll: "paper", fullWidth: true } }}
        >
            {() => {
                return (
                    <FinalForm
                        mode="edit"
                        onSubmit={() => {
                            console.log("Submitted!");
                        }}
                        onAfterSubmit={() => {
                            dialogApiRef.current?.closeDialog();
                        }}
                    >
                        <TextField name="name" label="Name" fullWidth />
                    </FinalForm>
                );
            }}
        </EditDialog>
    );
};

const AddStocksDialog: React.FC<DialogProps> = ({ dialogApiRef }) => {
    const intl = useIntl();

    return (
        <EditDialog
            ref={dialogApiRef}
            title={intl.formatMessage({ id: "addStocksDialog.title", defaultMessage: "Add a new Stock entry" })}
            componentsProps={{ dialog: { scroll: "paper", fullWidth: true } }}
        >
            {() => {
                return (
                    <FinalForm
                        mode="edit"
                        onSubmit={() => {
                            console.log("Submitted!");
                        }}
                        onAfterSubmit={() => {
                            dialogApiRef.current?.closeDialog();
                        }}
                    >
                        <TextField name="amount" label="Amount" fullWidth />
                    </FinalForm>
                );
            }}
        </EditDialog>
    );
};

function Toolbar({ toolbarAction }: { toolbarAction?: React.ReactNode }) {
    return (
        <DataGridToolbar>
            <ToolbarItem>
                <Typography>
                    <FormattedMessage
                        id="toolbar.helperText"
                        defaultMessage="Navigate to the Router Tabs with the edit button. Try to add new Stocks there."
                    />
                </Typography>
            </ToolbarItem>
            <ToolbarFillSpace />
            <ToolbarActions>{toolbarAction}</ToolbarActions>
        </DataGridToolbar>
    );
}

type ProductDetailsProps = {
    productId: string;
};

export const ProductDetailsPage: React.FC<ProductDetailsProps> = ({ productId }: ProductDetailsProps) => {
    const intl = useIntl();
    const editDialogApi = React.useRef<IEditDialogApi>(null);

    const rows: { id: string; productId: string; amount: string }[] = [];
    stocks.forEach((row) => {
        if (row.productId === productId) {
            rows.push(row);
        }
    });

    return (
        <RouterTabs>
            <RouterTab forceRender={true} path="" label={intl.formatMessage({ id: "products.details", defaultMessage: "Details" })}>
                <MainContent fullHeight disablePadding>
                    <FinalForm
                        mode="edit"
                        onSubmit={() => {
                            console.log("Submitted!");
                        }}
                        initialValues={{ name: products[Number(productId)].name }}
                    >
                        <TextField name="name" label="Name" fullWidth />
                    </FinalForm>
                </MainContent>
            </RouterTab>
            <RouterTab forceRender={true} path="/stocks" label={intl.formatMessage({ id: "products.stocks", defaultMessage: "Stocks" })}>
                <StackSwitch initialPage="stocks">
                    <StackPage name="stocks">
                        <AddStocksDialog dialogApiRef={editDialogApi} />
                        <MainContent fullHeight>
                            <DataGrid
                                columns={[
                                    { field: "id", headerName: "ID", width: 90 },
                                    { field: "amount", headerName: "Amount", flex: 1 },
                                    {
                                        field: "actions",
                                        headerName: "",
                                        sortable: false,
                                        filterable: false,
                                        type: "actions",
                                        align: "right",
                                        width: 86,
                                        renderCell: (params) => {
                                            return (
                                                <IconButton component={StackLink} pageName="stocksEdit" payload={params.row.id}>
                                                    <Edit color="primary" />
                                                </IconButton>
                                            );
                                        },
                                    },
                                ]}
                                rows={rows}
                                components={{
                                    Toolbar: Toolbar,
                                }}
                                componentsProps={{
                                    toolbar: {
                                        toolbarAction: (
                                            <Button
                                                startIcon={<Add />}
                                                onClick={() => editDialogApi.current?.openAddDialog()}
                                                variant="contained"
                                                color="primary"
                                            >
                                                <FormattedMessage {...messages.add} />
                                            </Button>
                                        ),
                                    },
                                }}
                            />
                        </MainContent>
                    </StackPage>
                    <StackPage name="stocksEdit" title={intl.formatMessage({ id: "products.editStocks", defaultMessage: "Edit Stocks" })}>
                        {(selectedStockId) => (
                            <SaveBoundary>
                                <MainContent fullHeight disablePadding>
                                    <StackToolbar>
                                        <ToolbarBackButton />
                                        <ToolbarAutomaticTitleItem />
                                        <ToolbarFillSpace />
                                        <ToolbarActions>
                                            <SaveBoundarySaveButton />
                                        </ToolbarActions>
                                    </StackToolbar>
                                    <FinalForm
                                        mode="edit"
                                        onSubmit={() => {
                                            console.log("Submitted!");
                                        }}
                                        initialValues={{ amount: stocks[Number(selectedStockId)].amount }}
                                    >
                                        <TextField name="amount" label="Amount" fullWidth />
                                    </FinalForm>
                                </MainContent>
                            </SaveBoundary>
                        )}
                    </StackPage>
                </StackSwitch>
            </RouterTab>
        </RouterTabs>
    );
};

function Story() {
    const intl = useIntl();
    const editDialogApi = React.useRef<IEditDialogApi>(null);

    return (
        <>
            <Stack topLevelTitle={intl.formatMessage({ id: "products.title", defaultMessage: "Products Page" })}>
                <StackSwitch initialPage="productsGrid">
                    <StackPage name="productsGrid">
                        <MainContent fullHeight disablePadding>
                            <DataGrid
                                columns={[
                                    { field: "id", headerName: "ID", width: 90 },
                                    { field: "name", headerName: "Name", flex: 1 },
                                    {
                                        field: "actions",
                                        headerName: "",
                                        sortable: false,
                                        filterable: false,
                                        type: "actions",
                                        align: "right",
                                        width: 86,
                                        renderCell: (params) => {
                                            return (
                                                <IconButton component={StackLink} pageName="productEdit" payload={params.row.id}>
                                                    <Edit color="primary" />
                                                </IconButton>
                                            );
                                        },
                                    },
                                ]}
                                rows={products}
                                components={{
                                    Toolbar: Toolbar,
                                }}
                                componentsProps={{
                                    toolbar: {
                                        toolbarAction: (
                                            <Button
                                                startIcon={<Add />}
                                                onClick={() => editDialogApi.current?.openAddDialog()}
                                                variant="contained"
                                                color="primary"
                                            >
                                                <FormattedMessage {...messages.add} />
                                            </Button>
                                        ),
                                    },
                                }}
                            />
                        </MainContent>
                    </StackPage>
                    <StackPage name="productEdit" title={intl.formatMessage({ id: "products.editProduct", defaultMessage: "Product" })}>
                        {(productId) => (
                            <MainContent fullHeight disablePadding>
                                <SaveBoundary>
                                    <StackToolbar>
                                        <ToolbarBackButton />
                                        <ToolbarAutomaticTitleItem />
                                        <ToolbarFillSpace />
                                        <ToolbarActions>
                                            <SaveBoundarySaveButton />
                                        </ToolbarActions>
                                    </StackToolbar>
                                    <ProductDetailsPage productId={productId} />
                                </SaveBoundary>
                            </MainContent>
                        )}
                    </StackPage>
                </StackSwitch>
            </Stack>

            <AddProductDialog dialogApiRef={editDialogApi} />
        </>
    );
}

storiesOf("@comet/admin/edit-dialog", module)
    .addDecorator(storyRouterDecorator())
    .add("Edit Dialog in RouterTabs within a Stack", () => <Story />);
