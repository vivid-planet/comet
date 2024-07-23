import {
    CancelButton,
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
import { Add as AddIcon } from "@comet/admin-icons";
import { ContentScopeIndicator } from "@comet/cms-admin";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { AssignProductsGrid } from "@src/products/categories/AssignProductsGrid";
import { ProductsGrid } from "@src/products/ProductsGrid";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
    const [isOpen, setIsOpen] = React.useState(false);
    const handleCloseDialog = () => {
        setIsOpen(false);
    };

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
                                            <ProductsGrid
                                                // TODO refresh ProductsGrid after saving assign-products
                                                toolbarAction={
                                                    <Button
                                                        startIcon={<AddIcon />}
                                                        onClick={() => setIsOpen(true)}
                                                        variant="contained"
                                                        color="primary"
                                                    >
                                                        <FormattedMessage
                                                            id="products.editProductCategory.assignProducts"
                                                            defaultMessage="Assign Products"
                                                        />
                                                    </Button>
                                                }
                                                filter={{ category: { equal: selectedId } }}
                                            />
                                            <SaveBoundary onAfterSave={() => setIsOpen(false)}>
                                                <Dialog open={isOpen} onClose={handleCloseDialog} fullWidth maxWidth="xl">
                                                    <DialogTitle>
                                                        <FormattedMessage
                                                            id="products.editProductCategory.assignProducts"
                                                            defaultMessage="Assign Products"
                                                        />
                                                    </DialogTitle>
                                                    <DialogContent
                                                        sx={{
                                                            height: "70vh",
                                                            padding: 0,
                                                            paddingTop: "0 !important" /* is connected to title-style */,
                                                        }}
                                                    >
                                                        <AssignProductsGrid productCategoryId={selectedId} />
                                                    </DialogContent>
                                                    <DialogActions>
                                                        {/* TODO Missing close-dialog-unsaved-changes-check */}
                                                        <CancelButton onClick={handleCloseDialog} />
                                                        <SaveBoundarySaveButton disabled={false} />
                                                    </DialogActions>
                                                </Dialog>
                                            </SaveBoundary>
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
