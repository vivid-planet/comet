import { Stack, StackPage, StackSwitch } from "@comet/admin";
import React from "react";
import { useIntl } from "react-intl";

import ProductForm from "./ProductForm";
import ProductsGrid from "./ProductsGrid";

const ProductsPage: React.FC = () => {
    const intl = useIntl();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.products", defaultMessage: "Products" })}>
            <StackSwitch initialPage="grid">
                <StackPage name="grid">
                    <ProductsGrid />
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "products.editProduct", defaultMessage: "Edit product" })}>
                    {(selectedId) => <ProductForm id={selectedId} />}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "products.addProduct", defaultMessage: "Add product" })}>
                    <ProductForm />
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};

export default ProductsPage;
