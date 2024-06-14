import {
    MainContent,
    RouterTab,
    RouterTabs,
    SaveBoundary,
    SaveBoundarySaveButton,
    Stack,
    StackPage,
    StackSwitch,
    StackSwitchApiContext,
    StackToolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
    ToolbarFillSpace,
} from "@comet/admin";
import { ProductVariantsGrid } from "@src/products/future/generated/ProductVariantsGrid";
import * as React from "react";
import { useIntl } from "react-intl";

import { ProductForm } from "./generated/ProductForm";
import { ProductPriceForm } from "./generated/ProductPriceForm";
import { ProductsGrid } from "./generated/ProductsGrid";

export function ProductsPage(): React.ReactElement {
    const intl = useIntl();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.products", defaultMessage: "Products" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <StackSwitchApiContext.Consumer>
                        {(stackApi) => {
                            return (
                                <MainContent fullHeight disablePadding>
                                    <ProductsGrid
                                        onAddClick={() => {
                                            stackApi.activatePage("add", "add");
                                        }}
                                        onEditClick={(params) => {
                                            stackApi.activatePage("edit", params.row.id);
                                        }}
                                    />
                                </MainContent>
                            );
                        }}
                    </StackSwitchApiContext.Consumer>
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "products.editProduct", defaultMessage: "Edit Product" })}>
                    {(selectedProductId) => (
                        <SaveBoundary>
                            <StackToolbar>
                                <ToolbarBackButton />
                                <ToolbarAutomaticTitleItem />
                                <ToolbarFillSpace />
                                <ToolbarActions>
                                    <SaveBoundarySaveButton />
                                </ToolbarActions>
                            </StackToolbar>
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
                            </RouterTabs>
                        </SaveBoundary>
                    )}
                </StackPage>
                <StackPage name="variants" title={intl.formatMessage({ id: "products.editProduct", defaultMessage: "Product variants" })}>
                    {(selectedId) => (
                        <MainContent fullHeight disablePadding>
                            <ProductVariantsGrid product={selectedId} />
                        </MainContent>
                    )}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "products.addProduct", defaultMessage: "Add Product" })}>
                    <ProductForm />
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}
