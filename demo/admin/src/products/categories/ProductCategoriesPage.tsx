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
} from "@comet/admin";
import { ContentScopeIndicator } from "@comet/cms-admin";
import { Box } from "@mui/material";
import { AssignedProductsGrid } from "@src/products/categories/AssignedProductsGrid";
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
                                            <AssignedProductsGrid productCategoryId={selectedId} />
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
