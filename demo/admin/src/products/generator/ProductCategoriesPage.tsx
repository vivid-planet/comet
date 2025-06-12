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
                    {/* eslint-disable-next-line @calm/react-intl/missing-formatted-message,@comet/no-jsx-string-literals */}
                    <StackMainContent>TODO: Add product category form</StackMainContent>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}
