import { Stack, StackLink, StackPage, StackSwitch } from "@comet/admin";
import { Add as AddIcon } from "@comet/admin-icons";
import { Button } from "@mui/material";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductForm } from "./generated/ProductForm";
import { ProductsGrid } from "./generated/ProductsGrid";

export function ProductsWithLowPricePage(): React.ReactElement {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.products", defaultMessage: "Products" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <ProductsGrid
                        filter={{ price: { lowerThan: 10 } }}
                        addButton={
                            <Button startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add" variant="contained" color="primary">
                                <FormattedMessage id="product.newProduct" defaultMessage="New Product" />
                            </Button>
                        }
                    />
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "products.editProduct", defaultMessage: "Edit Product" })}>
                    {(selectedId) => <ProductForm id={selectedId} />}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "products.addProduct", defaultMessage: "Add Product" })}>
                    <ProductForm />
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}
