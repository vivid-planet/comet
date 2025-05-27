import { Stack, StackMainContent, StackPage, StackSwitch, StackToolbar } from "@comet/admin";
import { ContentScopeIndicator } from "@comet/cms-admin";
import { useIntl } from "react-intl";

import { ProductCategoriesGrid } from "./generated/ProductCategoriesGrid";

export function ProductCategoriesPage() {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.productCategories", defaultMessage: "Product Categories" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
                    <StackMainContent fullHeight>
                        <ProductCategoriesGrid />
                    </StackMainContent>
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "products.addProductCategory", defaultMessage: "Add product category" })}>
                    <StackMainContent>Add product category</StackMainContent>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}
