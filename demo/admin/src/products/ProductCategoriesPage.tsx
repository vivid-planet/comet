import { Stack, StackMainContent, StackPage, StackSwitch, StackToolbar } from "@comet/admin";
import { ContentScopeIndicator } from "@comet/cms-admin";
import { ProductCategoriesGrid } from "@src/products/categories/ProductCategoriesGrid";
import { useIntl } from "react-intl";

export function ProductCategoriesHandmadePage() {
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
