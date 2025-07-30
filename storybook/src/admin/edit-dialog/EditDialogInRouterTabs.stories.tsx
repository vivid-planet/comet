import {
    Button,
    DataGridToolbar,
    EditDialog,
    FillSpace,
    FinalForm,
    type IEditDialogApi,
    MainContent,
    messages,
    RouterTab,
    RouterTabs,
    TextField,
} from "@comet/admin";
import { Add } from "@comet/admin-icons";
import { DialogContent, Typography } from "@mui/material";
import { DataGrid, type GridToolbarProps } from "@mui/x-data-grid";
import { type ReactNode, type RefObject, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { storyRouterDecorator } from "../../story-router.decorator";

export default {
    title: "@comet/admin/edit-dialog",
    decorators: [storyRouterDecorator()],
};

const products = [
    { id: "1", name: "Product 1" },
    { id: "2", name: "Product 2" },
    { id: "3", name: "Product 3" },
    { id: "4", name: "Product 4" },
    { id: "5", name: "Product 5" },
];

type DialogProps = {
    dialogApiRef: RefObject<IEditDialogApi>;
};

const AddProductDialog = ({ dialogApiRef }: DialogProps) => {
    const intl = useIntl();

    return (
        <EditDialog
            ref={dialogApiRef}
            title={intl.formatMessage({ id: "addProductDialog.title", defaultMessage: "Add a new Product" })}
            componentsProps={{ dialog: { scroll: "paper", fullWidth: true } }}
        >
            {() => {
                return (
                    <DialogContent>
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
                    </DialogContent>
                );
            }}
        </EditDialog>
    );
};

interface ToolbarProps extends GridToolbarProps {
    toolbarAction?: ReactNode;
}

function Toolbar({ toolbarAction }: ToolbarProps) {
    return (
        <DataGridToolbar>
            <FillSpace />
            {toolbarAction}
        </DataGridToolbar>
    );
}

export const EditDialogInRouterTabs = {
    render: () => {
        const editDialogApi = useRef<IEditDialogApi>(null);
        return (
            <RouterTabs>
                <RouterTab path="" label="First Tab">
                    <MainContent fullHeight disablePadding>
                        <Typography>Hello, I am the first Tab. The Add Dialog in the second Tab navigates here.</Typography>
                    </MainContent>
                </RouterTab>
                <RouterTab path="/second" label="Second Tab">
                    <AddProductDialog dialogApiRef={editDialogApi} />
                    <MainContent fullHeight disablePadding>
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
                                        <Button startIcon={<Add />} onClick={() => editDialogApi.current?.openAddDialog()}>
                                            <FormattedMessage {...messages.add} />
                                        </Button>
                                    ),
                                } as ToolbarProps,
                            }}
                        />
                    </MainContent>
                </RouterTab>
            </RouterTabs>
        );
    },
    name: "EditDialog in RouterTabs",
};
