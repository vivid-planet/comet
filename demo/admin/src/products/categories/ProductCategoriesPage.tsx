import {
    MainContent,
    RouterTab,
    RouterTabs,
    SaveBoundary,
    SaveBoundarySaveButton,
    Stack,
    StackPage,
    StackSwitch,
    StackToolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
    ToolbarFillSpace,
    useEditDialog,
} from "@comet/admin";
import { ContentScopeIndicator } from "@comet/cms-admin";
import { Box } from "@mui/material";
import { AssignProductsGrid } from "@src/products/categories/AssignProductsGrid";
import { ProductsGrid } from "@src/products/ProductsGrid";
import React from "react";
import { useIntl } from "react-intl";

import ProductCategoriesTable from "./ProductCategoriesTable";
import ProductCategoryForm from "./ProductCategoryForm";

const FormToolbar = () => (
    <StackToolbar scopeIndicator={<ContentScopeIndicator global />}>
        <ToolbarBackButton />
        <ToolbarAutomaticTitleItem />
        <ToolbarFillSpace />
        <ToolbarActions>
            <SaveBoundarySaveButton />
        </ToolbarActions>
    </StackToolbar>
);

const ProductCategoriesPage: React.FC = () => {
    const intl = useIntl();
    const [EditDialog] = useEditDialog();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.productCategories", defaultMessage: "Product Categories Handmade" })}>
            <StackSwitch initialPage="table">
                <StackPage name="table">
                    <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
                    <MainContent fullHeight>
                        <ProductCategoriesTable />
                    </MainContent>
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "products.editProductCategory", defaultMessage: "Edit product category" })}>
                    {(selectedId) => (
                        <SaveBoundary>
                            <FormToolbar />
                            <MainContent fullHeight>
                                <RouterTabs>
                                    <RouterTab
                                        forceRender={true}
                                        path=""
                                        label={intl.formatMessage({ id: "products.editProductCategory.formTab", defaultMessage: "Product category" })}
                                    >
                                        <ProductCategoryForm id={selectedId} />
                                    </RouterTab>
                                    <RouterTab
                                        forceRender={true}
                                        path="/assigned-products"
                                        label={intl.formatMessage({
                                            id: "products.editProductCategory.assignedProducts",
                                            defaultMessage: "Assigned Products",
                                        })}
                                    >
                                        <Box sx={{ height: "100vh" }}>
                                            <ProductsGrid filter={{ category: { equal: selectedId } }} />
                                            {/* TODO change button behaviour and open edit-dialog, open discussion https://github.com/vivid-planet/comet/pull/2171 */}
                                            <EditDialog
                                                componentsProps={{
                                                    dialog: { fullWidth: true, maxWidth: "xl" },
                                                    dialogContent: {
                                                        sx: {
                                                            height: "70vh",
                                                            padding: 0,
                                                            paddingTop: "0 !important" /* is connected to title-style */,
                                                        },
                                                    },
                                                }}
                                            >
                                                <AssignProductsGrid productCategoryId={selectedId} />
                                            </EditDialog>
                                        </Box>
                                    </RouterTab>
                                </RouterTabs>
                            </MainContent>
                        </SaveBoundary>
                    )}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "products.addProductCategory", defaultMessage: "Add product category" })}>
                    <SaveBoundary>
                        <FormToolbar />
                        <ProductCategoryForm />
                    </SaveBoundary>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};

export default ProductCategoriesPage;
