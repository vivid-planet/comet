import { Stack, StackPage, StackSwitch } from "@comet/admin";
import ShopProductsDataGrid from "@src/shop/dataGrid/ShopProductsDataGrid";
import { ShopProductFinalForm } from "@src/shop/form/ShopProductFinalForm";
import React from "react";
import { useIntl } from "react-intl";

const ProductsStackPage: React.FC = () => {
    const intl = useIntl();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "shopProducts", defaultMessage: "Products" })}>
            <StackSwitch initialPage="table">
                <StackPage name="table">
                    <ShopProductsDataGrid />
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "shopProducts.editProduct", defaultMessage: "Edit products" })}>
                    {(selectedId) => <ShopProductFinalForm shopProductId={selectedId} />}
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};

export default ProductsStackPage;
