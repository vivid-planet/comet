import {
    MainContent,
    SaveBoundary,
    SaveBoundarySaveButton,
    Stack,
    StackPage,
    StackSwitch,
    StackToolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
    ToolbarFillSpace,
} from "@comet/admin";
import { ContentScopeIndicator } from "@comet/cms-admin";
import * as React from "react";
import { useIntl } from "react-intl";

import { ProductCategoriesGrid } from "./generated/ProductCategoriesGrid";
import { ProductCategoryForm } from "./generated/ProductCategoryForm";

const FormToolbar = () => (
    <StackToolbar scopeIndicator={<ContentScopeIndicator global />}>
        <ToolbarBackButton />
        <ToolbarAutomaticTitleItem />
        <ToolbarFillSpace />
        <ToolbarActions>
            <SaveBoundarySaveButton />
        </ToolbarActions>
    </StackToolbar>
);

export function FutureProductCategoriesPage(): React.ReactElement {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.productCategories", defaultMessage: "Product Categories" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
                    <MainContent fullHeight>
                        <ProductCategoriesGrid />
                    </MainContent>
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "products.editProductCategory", defaultMessage: "Edit Product Category" })}>
                    {(selectedProductCategoryId) => (
                        <SaveBoundary>
                            <FormToolbar />
                            <ProductCategoryForm id={selectedProductCategoryId} />
                        </SaveBoundary>
                    )}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "products.addProductCategory", defaultMessage: "Add Product Category" })}>
                    <SaveBoundary>
                        <FormToolbar />
                        <ProductCategoryForm />
                    </SaveBoundary>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}
