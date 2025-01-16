import { Add, Edit } from "@comet/admin-icons";
import { Button, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { screen, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { ReactNode, RefObject, useRef } from "react";
import { useIntl } from "react-intl";
import { Router } from "react-router";
import { render } from "test-utils";

import { MainContent } from "./common/MainContent";
import { ToolbarActions } from "./common/toolbar/actions/ToolbarActions";
import { ToolbarAutomaticTitleItem } from "./common/toolbar/automatictitleitem/ToolbarAutomaticTitleItem";
import { ToolbarBackButton } from "./common/toolbar/backbutton/ToolbarBackButton";
import { DataGridToolbar } from "./common/toolbar/DataGridToolbar";
import { ToolbarFillSpace } from "./common/toolbar/fillspace/ToolbarFillSpace";
import { StackToolbar } from "./common/toolbar/StackToolbar";
import { EditDialog } from "./EditDialog";
import { IEditDialogApi } from "./EditDialogApiContext";
import { FinalForm } from "./FinalForm";
import { TextField } from "./form/fields/TextField";
import { SaveBoundary } from "./saveBoundary/SaveBoundary";
import { SaveBoundarySaveButton } from "./saveBoundary/SaveBoundarySaveButton";
import { StackPage } from "./stack/Page";
import { Stack } from "./stack/Stack";
import { StackLink } from "./stack/StackLink";
import { StackSwitch } from "./stack/Switch";
import { RouterTab, RouterTabs } from "./tabs/RouterTabs";

describe("EditDialog with Stack, Router Tabs and Grid", () => {
    type DialogProps = {
        dialogApiRef: RefObject<IEditDialogApi>;
    };

    const AddProductDialog = ({ dialogApiRef }: DialogProps) => {
        const intl = useIntl();

        return (
            <EditDialog
                ref={dialogApiRef}
                title={intl.formatMessage({ id: "addProductDialog.title", defaultMessage: "Add a new product" })}
                componentsProps={{ dialog: { scroll: "paper", fullWidth: true } }}
            >
                {() => {
                    return (
                        <FinalForm
                            mode="add"
                            onSubmit={() => {
                                // console.log("Submitted!");
                            }}
                        >
                            <TextField name="name" label="Name" fullWidth />
                        </FinalForm>
                    );
                }}
            </EditDialog>
        );
    };

    function Toolbar({ toolbarAction }: { toolbarAction?: ReactNode }) {
        return (
            <DataGridToolbar>
                <ToolbarFillSpace />
                <ToolbarActions>{toolbarAction}</ToolbarActions>
            </DataGridToolbar>
        );
    }

    function StackWithGridAndEditDialog() {
        const editDialogApi = useRef<IEditDialogApi>(null);

        return (
            <Stack topLevelTitle="Nested Stack">
                <StackSwitch>
                    <StackPage name="products" title="Products">
                        <RouterTabs>
                            <RouterTab label="Customers" path="">
                                Customers Page
                            </RouterTab>
                            <RouterTab label="Products" path="/products">
                                <AddProductDialog dialogApiRef={editDialogApi} />

                                <DataGrid
                                    columns={[
                                        { field: "id", headerName: "ID", width: 90 },
                                        {
                                            field: "actions",
                                            headerName: "",
                                            sortable: false,
                                            filterable: false,
                                            align: "right",
                                            width: 86,
                                            renderCell: (params) => {
                                                return (
                                                    <IconButton
                                                        data-testid="edit.row"
                                                        color="primary"
                                                        component={StackLink}
                                                        pageName="productEdit"
                                                        payload={params.row.id}
                                                        onClick={() => editDialogApi.current?.openEditDialog(params.row.id)}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                );
                                            },
                                        },
                                    ]}
                                    rows={[
                                        { id: "0", productId: "0" },
                                        { id: "1", productId: "0" },
                                        { id: "2", productId: "0" },
                                        { id: "3", productId: "1" },
                                        { id: "4", productId: "1" },
                                        { id: "5", productId: "1" },
                                    ]}
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
                                                    Add product
                                                </Button>
                                            ),
                                        },
                                    }}
                                    disableVirtualization
                                />
                            </RouterTab>
                        </RouterTabs>
                    </StackPage>
                    <StackPage name="productEdit" title="Product">
                        {() => (
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
                                    <div>Product Edit Page</div>
                                </SaveBoundary>
                            </MainContent>
                        )}
                    </StackPage>
                </StackSwitch>
            </Stack>
        );
    }

    it("should navigate to the products page and route when clicking on the products tab", async () => {
        const history = createMemoryHistory();

        const rendered = render(
            <Router history={history}>
                <StackWithGridAndEditDialog />
            </Router>,
        );

        expect(history.location.pathname).toBe("/");
        rendered.getByText("Products").click();
        expect(screen.getByText("Products")).toBeInTheDocument();
        expect(history.location.pathname).toBe("/index/products");

        // Check that the Edit Dialog is not open, there was a bug that was fixed
        // where the edit dialog was open when navigating to a different tab
        expect(screen.queryByText("Add a new product")).not.toBeInTheDocument();
    });

    it("should stay on the products page when closing the edit dialog", async () => {
        const history = createMemoryHistory({
            initialEntries: ["/", "/products"],
            initialIndex: 0,
        });

        const rendered = render(
            <Router history={history}>
                <StackWithGridAndEditDialog />
            </Router>,
        );

        expect(history.location.pathname).toBe("/");
        expect(screen.getByText("Customers Page")).toBeInTheDocument();

        rendered.getByText("Products").click();
        expect(rendered.getByText("Add product")).toBeInTheDocument();
        expect(history.location.pathname).toBe("/index/products");

        rendered.getByText("Add product").click();
        expect(screen.getByText("Add a new product")).toBeInTheDocument();
        expect(history.location.pathname).toBe("/index/products/add");

        await waitFor(() => {
            rendered.getByText("Cancel").click();
        });

        // Check that the Edit Dialog is not open and user is still on
        // the products page, there was a bug where the user was navigated
        // back to the first tab after closing the edit dialog
        expect(screen.queryByText("Add a new product")).not.toBeInTheDocument();
        expect(history.location.pathname).toBe("/index/products");
        expect(screen.queryByText("Customers Page")).not.toBeInTheDocument();
    });

    it("should open product add dialog when clicking on Add product button in grid toolbar", async () => {
        const history = createMemoryHistory();

        const rendered = render(
            <Router history={history}>
                <StackWithGridAndEditDialog />
            </Router>,
        );

        rendered.getByText("Products").click();
        expect(screen.getByText("Products")).toBeInTheDocument();

        expect(rendered.getByText("Add product")).toBeInTheDocument();
        rendered.getByText("Add product").click();
        expect(screen.getByText("Add a new product")).toBeInTheDocument();
    });

    it("should open edit stack page when clicking on edit button in grid", async () => {
        const history = createMemoryHistory();

        const rendered = render(
            <Router history={history}>
                <StackWithGridAndEditDialog />
            </Router>,
        );

        rendered.getByText("Products").click();
        expect(screen.getByText("Products")).toBeInTheDocument();

        expect(rendered.getByText("Add product")).toBeInTheDocument();
        expect(rendered.queryAllByTestId("edit.row")).toHaveLength(6);
        rendered.queryAllByTestId("edit.row")[5].click();
        expect(screen.getByText("Product Edit Page")).toBeInTheDocument();
    });
});
