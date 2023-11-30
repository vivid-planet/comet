import { Stack, StackPage, StackSwitch } from "@comet/admin";
import React from "react";
import { useIntl } from "react-intl";

import ProductTagForm from "./ProductTagForm";
import ProductTagsTable from "./ProductTagTable";

const ProductTagsPage: React.FC = () => {
    const intl = useIntl();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.productTags", defaultMessage: "Product Tags" })}>
            <StackSwitch initialPage="table">
                <StackPage name="table">
                    <ProductTagsTable />
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "products.editProductTag", defaultMessage: "Edit product Tag" })}>
                    {(selectedId) => <ProductTagForm id={selectedId} />}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "products.addProductTag", defaultMessage: "Add product Tag" })}>
                    <ProductTagForm />
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};

export default ProductTagsPage;
