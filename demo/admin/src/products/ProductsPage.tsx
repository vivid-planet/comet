import {
    RouterTab,
    RouterTabs,
    SaveBoundary,
    SaveBoundarySaveButton,
    Stack,
    StackPage,
    StackSwitch,
    Toolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
    ToolbarFillSpace,
} from "@comet/admin";
import React from "react";
import { useIntl } from "react-intl";

import ProductForm from "./ProductForm";
import ProductPriceForm from "./ProductPriceForm";
import ProductsGrid from "./ProductsGrid";
import ProductVariantsGrid from "./ProductVariantsGrid";

const ProductsPage: React.FC = () => {
    const intl = useIntl();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.products", defaultMessage: "Products" })}>
            <StackSwitch initialPage="grid">
                <StackPage name="grid">
                    <ProductsGrid />
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "products.editProduct", defaultMessage: "Edit product" })}>
                    {(selectedId) => (
                        <SaveBoundary>
                            <Toolbar>
                                <ToolbarBackButton />
                                <ToolbarAutomaticTitleItem />
                                <ToolbarFillSpace />
                                <ToolbarActions>
                                    <SaveBoundarySaveButton />
                                </ToolbarActions>
                            </Toolbar>
                            <RouterTabs>
                                <RouterTab
                                    forceRender={true}
                                    path=""
                                    label={intl.formatMessage({ id: "products.product", defaultMessage: "Product" })}
                                >
                                    <ProductForm id={selectedId} />
                                </RouterTab>
                                <RouterTab
                                    forceRender={true}
                                    path="/price"
                                    label={intl.formatMessage({ id: "products.price", defaultMessage: "Price" })}
                                >
                                    <ProductPriceForm id={selectedId} />
                                </RouterTab>
                                <RouterTab path="/variants" label={intl.formatMessage({ id: "products.variants", defaultMessage: "Variants" })}>
                                    <StackSwitch initialPage="table">
                                        <StackPage name="table">
                                            <ProductVariantsGrid productId={selectedId} />
                                        </StackPage>
                                        <StackPage
                                            name="edit"
                                            title={intl.formatMessage({ id: "products.editProductVariant", defaultMessage: "Edit Product Variant" })}
                                        >
                                            {(selectedId) => <>TODO: edit variant {selectedId}</>}
                                        </StackPage>
                                        <StackPage
                                            name="add"
                                            title={intl.formatMessage({ id: "products.addProductVariant", defaultMessage: "Add Product Variant" })}
                                        >
                                            TODO: add variant
                                        </StackPage>
                                    </StackSwitch>
                                </RouterTab>
                            </RouterTabs>
                        </SaveBoundary>
                    )}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "products.addProduct", defaultMessage: "Add product" })}>
                    <ProductForm />
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};

export default ProductsPage;
