import { Stack, StackPage, StackSwitch } from "@comet/admin";
import ProductHookForm from "@src/products/ProductHookForm";
import React from "react";
import { useIntl } from "react-intl";

import ProductForm from "./ProductForm";
import ProductsTable from "./ProductsTable";

const ProductsPage: React.FC = () => {
    const intl = useIntl();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "comet.products.products", defaultMessage: "Products" })}>
            <StackSwitch initialPage="table">
                <StackPage name="table">
                    <ProductsTable />
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "comet.products.editProduct", defaultMessage: "Edit product" })}>
                    {(selectedId) => <ProductForm id={selectedId} />}
                </StackPage>
                <StackPage name="edit-hook-form" title={intl.formatMessage({ id: "comet.products.editProduct", defaultMessage: "Edit product" })}>
                    {(selectedId) => <ProductHookForm id={selectedId} />}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "comet.products.addProduct", defaultMessage: "Add product" })}>
                    <ProductForm />
                </StackPage>
                <StackPage name="add-hook-form" title={intl.formatMessage({ id: "comet.products.addProduct", defaultMessage: "Add product" })}>
                    <ProductHookForm />
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};

export default ProductsPage;
