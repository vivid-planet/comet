import { MainContent, Stack, StackPage, StackSwitch, Toolbar } from "@comet/admin";
import * as React from "react";
import { useIntl } from "react-intl";

import { ProductForm } from "./generated/ProductForm";
import { ProductsGrid } from "./generated/ProductsGrid";

export function ProductsWithLowPricePage(): React.ReactElement {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.products", defaultMessage: "Products" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <Toolbar />
                    <MainContent fullHeight>
                        <ProductsGrid filter={{ price: { lowerThan: 10 } }} />
                    </MainContent>
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
