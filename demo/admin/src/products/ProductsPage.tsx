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
import React from "react";
import { useIntl } from "react-intl";

import { ProductForm } from "./ProductForm";
import { ProductPriceForm } from "./ProductPriceForm";
import { ProductsGrid } from "./ProductsGrid";
import { ProductVariantForm } from "./ProductVariantForm";
import { ProductVariantsGrid } from "./ProductVariantsGrid";

const ProductsPage: React.FC = () => {
    const intl = useIntl();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.products", defaultMessage: "Products" })}>
            <StackSwitch initialPage="grid">
                <StackPage name="grid">
                    <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
                    <ProductsGrid />
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "products.editProduct", defaultMessage: "Edit product" })}>
                    {(selectedProductId) => (
                        <SaveBoundary>
                            <StackToolbar scopeIndicator={<ContentScopeIndicator global />}>
                                <ToolbarBackButton />
                                <ToolbarAutomaticTitleItem />
                                <ToolbarFillSpace />
                                <ToolbarActions>
                                    <SaveBoundarySaveButton />
                                </ToolbarActions>
                            </StackToolbar>
                            <MainContent>
                                <RouterTabs>
                                    <RouterTab
                                        forceRender={true}
                                        path=""
                                        label={intl.formatMessage({ id: "products.product", defaultMessage: "Product" })}
                                    >
                                        <ProductForm id={selectedProductId} />
                                    </RouterTab>
                                    <RouterTab
                                        forceRender={true}
                                        path="/price"
                                        label={intl.formatMessage({ id: "products.price", defaultMessage: "Price" })}
                                    >
                                        <ProductPriceForm id={selectedProductId} />
                                    </RouterTab>
                                    <RouterTab path="/variants" label={intl.formatMessage({ id: "products.variants", defaultMessage: "Variants" })}>
                                        <StackSwitch initialPage="table">
                                            <StackPage name="table">
                                                <ProductVariantsGrid productId={selectedProductId} />
                                            </StackPage>
                                            <StackPage
                                                name="edit"
                                                title={intl.formatMessage({
                                                    id: "products.editProductVariant",
                                                    defaultMessage: "Edit Product Variant",
                                                })}
                                            >
                                                {(selectedProductVariantId) => (
                                                    <SaveBoundary>
                                                        <StackToolbar scopeIndicator={<ContentScopeIndicator global />}>
                                                            <ToolbarBackButton />
                                                            <ToolbarAutomaticTitleItem />
                                                            <ToolbarFillSpace />
                                                            <ToolbarActions>
                                                                <SaveBoundarySaveButton />
                                                            </ToolbarActions>
                                                        </StackToolbar>
                                                        <ProductVariantForm productId={selectedProductId} id={selectedProductVariantId} />
                                                    </SaveBoundary>
                                                )}
                                            </StackPage>
                                            <StackPage
                                                name="add"
                                                title={intl.formatMessage({
                                                    id: "products.addProductVariant",
                                                    defaultMessage: "Add Product Variant",
                                                })}
                                            >
                                                <SaveBoundary>
                                                    <StackToolbar scopeIndicator={<ContentScopeIndicator global />}>
                                                        <ToolbarBackButton />
                                                        <ToolbarAutomaticTitleItem />
                                                        <ToolbarFillSpace />
                                                        <ToolbarActions>
                                                            <SaveBoundarySaveButton />
                                                        </ToolbarActions>
                                                    </StackToolbar>
                                                    <ProductVariantForm productId={selectedProductId} />
                                                </SaveBoundary>
                                            </StackPage>
                                        </StackSwitch>
                                    </RouterTab>
                                </RouterTabs>
                            </MainContent>
                        </SaveBoundary>
                    )}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "products.addProduct", defaultMessage: "Add product" })}>
                    <SaveBoundary>
                        <StackToolbar scopeIndicator={<ContentScopeIndicator global />}>
                            <ToolbarBackButton />
                            <ToolbarAutomaticTitleItem />
                            <ToolbarFillSpace />
                            <ToolbarActions>
                                <SaveBoundarySaveButton />
                            </ToolbarActions>
                        </StackToolbar>
                        <ProductForm />
                    </SaveBoundary>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};

export default ProductsPage;
