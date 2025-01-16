import { Add, Edit } from "@comet/admin-icons";
import { Button, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { screen } from "@testing-library/react";
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
    const history = createMemoryHistory();

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
                                // Submit logic
                            }}
                        >
                            <TextField name="name" label="Name" fullWidth />
                        </FinalForm>
                    );
                }}
            </EditDialog>
        );
    };

    const rows = [
        { id: "0", productId: "0", amount: "3" },
        { id: "1", productId: "0", amount: "6" },
        { id: "2", productId: "0", amount: "2" },
        { id: "3", productId: "1", amount: "4" },
        { id: "4", productId: "1", amount: "5" },
        { id: "5", productId: "1", amount: "7" },
    ];

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
            <>
                <Stack topLevelTitle="Nested Stack">
                    <StackSwitch>
                        <StackPage name="products" title="Products">
                            <RouterTabs>
                                <RouterTab label="Products" path="" forceRender={true}>
                                    <DataGrid
                                        columns={[
                                            { field: "id", headerName: "ID", width: 90 },
                                            { field: "amount", headerName: "Amount", flex: 1 },
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
                                                        Add product
                                                    </Button>
                                                ),
                                            },
                                        }}
                                        disableVirtualization
                                    />
                                </RouterTab>
                                <RouterTab label="Customers" path="/customers" forceRender={true}>
                                    Customers Page
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
                <AddProductDialog dialogApiRef={editDialogApi} />
            </>
        );
    }

    it("should open add dialog when clicking on Add product button in grid toolbar", async () => {
        const rendered = render(
            <Router history={history}>
                <StackWithGridAndEditDialog />
            </Router>,
        );

        expect(rendered.getByText("Add product")).toBeInTheDocument();
        rendered.getByText("Add product").click();
        expect(screen.getByText("Add a new product")).toBeInTheDocument();
    });

    it("should open edit stack page when clicking on edit button in grid", async () => {
        const rendered = render(
            <Router history={history}>
                <StackWithGridAndEditDialog />
            </Router>,
        );

        expect(rendered.getByText("Add product")).toBeInTheDocument();
        expect(rendered.queryAllByTestId("edit.row")).toHaveLength(6);
        rendered.queryAllByTestId("edit.row")[5].click();
        expect(screen.getByText("Product Edit Page")).toBeInTheDocument();
    });
});
