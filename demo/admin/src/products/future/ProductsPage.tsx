import { Stack, StackPage, StackSwitch } from "@comet/admin";
import { ProductVariantsGrid } from "@src/products/future/generated/ProductVariantsGrid";
import * as React from "react";
import { useIntl } from "react-intl";

import { ProductForm } from "./generated/ProductForm";
import { ProductsGrid } from "./generated/ProductsGrid";

export function ProductsPage(): React.ReactElement {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.products", defaultMessage: "Products" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <ProductsGrid />
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "products.editProduct", defaultMessage: "Edit Product" })}>
                    {(selectedId) => <ProductForm id={selectedId} />}
                </StackPage>
                <StackPage name="variants" title={intl.formatMessage({ id: "products.editProduct", defaultMessage: "Product variants" })}>
                    {(selectedId) => <ProductVariantsGrid product={selectedId} />}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "products.addProduct", defaultMessage: "Add Product" })}>
                    <ProductForm />
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}
