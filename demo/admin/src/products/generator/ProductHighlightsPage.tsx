import {
    FillSpace,
    MainContent,
    SaveBoundary,
    SaveBoundarySaveButton,
    Stack,
    StackMainContent,
    StackPage,
    StackSwitch,
    StackToolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
} from "@comet/admin";
import { ContentScopeIndicator } from "@comet/cms-admin";
import { useIntl } from "react-intl";

import { ProductHighlightForm } from "./generated/ProductHighlightForm";
import { ProductHighlightsGrid } from "./generated/ProductHighlightsGrid";

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

export function ProductHighlightsPage() {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.productHighlights", defaultMessage: "Product Highlights" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
                    <StackMainContent fullHeight>
                        <ProductHighlightsGrid />
                    </StackMainContent>
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "products.editProductHighlight", defaultMessage: "Edit Product Highlight" })}>
                    {(selectedProductId) => (
                        <SaveBoundary>
                            <>
                                <FormToolbar />
                                <MainContent>
                                    <ProductHighlightForm id={selectedProductId} productCategory="asdf" />
                                </MainContent>
                            </>
                        </SaveBoundary>
                    )}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "products.addProductHighlight", defaultMessage: "Add Product Highlight" })}>
                    <SaveBoundary>
                        <FormToolbar />
                        <MainContent>
                            <ProductHighlightForm productCategory="asdf" />
                        </MainContent>
                    </SaveBoundary>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}
