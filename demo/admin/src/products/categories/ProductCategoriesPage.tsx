import { Stack, StackPage, StackSwitch } from "@comet/admin";
import React from "react";
import { useIntl } from "react-intl";

import ProductCategoriesTable from "./ProductCategoriesTable";
import ProductCategoryForm from "./ProductCategoryForm";

const ProductCategoriesPage: React.FC = () => {
    const intl = useIntl();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.productCategories", defaultMessage: "Product Categories" })}>
            <StackSwitch initialPage="table">
                <StackPage name="table">
                    <ProductCategoriesTable />
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "products.editProductCategory", defaultMessage: "Edit product category" })}>
                    {(selectedId) => <ProductCategoryForm id={selectedId} />}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "products.addProductCategory", defaultMessage: "Add product category" })}>
                    <ProductCategoryForm />
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};

export default ProductCategoriesPage;
