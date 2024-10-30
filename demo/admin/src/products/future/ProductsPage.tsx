import {
    MainContent,
    RouterTab,
    RouterTabs,
    SaveBoundary,
    SaveBoundarySaveButton,
    Stack,
    StackLink,
    StackPage,
    StackSwitch,
    StackToolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
    ToolbarFillSpace,
} from "@comet/admin";
import { Add as AddIcon, Edit } from "@comet/admin-icons";
import { ContentScopeIndicator } from "@comet/cms-admin";
import { Button, IconButton } from "@mui/material";
import { ProductVariantsGrid } from "@src/products/future/generated/ProductVariantsGrid";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductForm } from "./generated/ProductForm";
import { ProductPriceForm } from "./generated/ProductPriceForm";
import { ProductsGrid } from "./generated/ProductsGrid";

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

export function ProductsPage() {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.products", defaultMessage: "Products" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
                    <MainContent fullHeight>
                        <ProductsGrid
                            toolbarAction={
                                <Button
                                    startIcon={<AddIcon />}
                                    component={StackLink}
                                    pageName="add"
                                    payload="add"
                                    variant="contained"
                                    color="primary"
                                >
                                    <FormattedMessage id="product.newProduct" defaultMessage="New Product" />
                                </Button>
                            }
                            rowAction={(params) => (
                                <IconButton component={StackLink} pageName="edit" payload={params.row.id}>
                                    <Edit color="primary" />
                                </IconButton>
                            )}
                            actionsColumnWidth={116}
                        />
                    </MainContent>
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "products.editProduct", defaultMessage: "Edit Product" })}>
                    {(selectedProductId) => (
                        <SaveBoundary>
                            <FormToolbar />
                            <RouterTabs>
                                <RouterTab
                                    forceRender={true}
                                    path=""
                                    label={intl.formatMessage({ id: "products.product", defaultMessage: "Product" })}
                                >
                                    <MainContent>
                                        <ProductForm id={selectedProductId} manufacturerCountry="DE" />
                                    </MainContent>
                                </RouterTab>
                                <RouterTab
                                    forceRender={true}
                                    path="/price"
                                    label={intl.formatMessage({ id: "products.price", defaultMessage: "Price" })}
                                >
                                    <MainContent>
                                        <ProductPriceForm id={selectedProductId} />
                                    </MainContent>
                                </RouterTab>
                            </RouterTabs>
                        </SaveBoundary>
                    )}
                </StackPage>
                <StackPage
                    name="variants"
                    title={intl.formatMessage({
                        id: "products.editProduct",
                        defaultMessage: "Product variants",
                    })}
                >
                    {(selectedId) => (
                        <>
                            <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
                            <MainContent fullHeight>
                                <ProductVariantsGrid product={selectedId} />
                            </MainContent>
                        </>
                    )}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "products.addProduct", defaultMessage: "Add Product" })}>
                    <SaveBoundary>
                        <FormToolbar />
                        <MainContent>
                            <ProductForm manufacturerCountry="DE" />
                        </MainContent>
                    </SaveBoundary>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}
