import { Stack, StackBreadcrumbs, StackPage, StackSwitch } from "@comet/admin";
import { ShopProductsDataGrid } from "@src/shop/dataGrid/ShopProductsDataGrid";
import { ShopProductPage } from "@src/shop/shopProductPage/ShopProductPage";
import React from "react";
import { useIntl } from "react-intl";

const ProductsStackPage: React.FC = () => {
    const intl = useIntl();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "shopProducts", defaultMessage: "Products" })}>
            <StackBreadcrumbs />
            <StackSwitch initialPage="table">
                <StackPage name="table">
                    <ShopProductsDataGrid />
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "shopProducts.editProduct", defaultMessage: "Edit products" })}>
                    {(selectedId) => <ShopProductPage shopProductId={selectedId} />}
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};

export default ProductsStackPage;
