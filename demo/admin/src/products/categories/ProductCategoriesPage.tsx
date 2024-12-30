import {
    FillSpace,
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
} from "@comet/admin";
import { ContentScopeIndicator } from "@comet/cms-admin";
import { useIntl } from "react-intl";

import ProductCategoriesTable from "./ProductCategoriesTable";
import ProductCategoryForm from "./ProductCategoryForm";

const FormToolbar = () => (
    <StackToolbar scopeIndicator={<ContentScopeIndicator global />}>
        <ToolbarBackButton />
        <ToolbarAutomaticTitleItem />
        <FillSpace />
        <ToolbarActions>
            <SaveBoundarySaveButton />
        </ToolbarActions>
    </StackToolbar>
);

const ProductCategoriesPage = () => {
    const intl = useIntl();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.productCategories", defaultMessage: "Product Categories" })}>
            <StackSwitch initialPage="table">
                <StackPage name="table">
                    <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
                    <MainContent fullHeight>
                        <ProductCategoriesTable />
                    </MainContent>
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "products.editProductCategory", defaultMessage: "Edit product category" })}>
                    {(selectedId) => (
                        <SaveBoundary>
                            <FormToolbar />
                            <ProductCategoryForm id={selectedId} />
                        </SaveBoundary>
                    )}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "products.addProductCategory", defaultMessage: "Add product category" })}>
                    <SaveBoundary>
                        <FormToolbar />
                        <ProductCategoryForm />
                    </SaveBoundary>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};

export default ProductCategoriesPage;
