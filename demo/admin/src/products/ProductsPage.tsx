import { Stack, StackPage, StackSwitch } from "@comet/admin";
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
                <StackPage name="add" title={intl.formatMessage({ id: "comet.products.addProduct", defaultMessage: "Add product" })}>
                    <ProductForm />
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};

export default ProductsPage;
