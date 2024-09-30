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

import { ProductForm } from "./generated/ExampleProductForm";
import { ProductsGrid } from "./generated/ExampleProductsGrid";

const formToolbar = (
    <StackToolbar scopeIndicator={<ContentScopeIndicator global />}>
        <ToolbarBackButton />
        <ToolbarAutomaticTitleItem />
        <ToolbarFillSpace />
        <ToolbarActions>
            <SaveBoundarySaveButton />
        </ToolbarActions>
    </StackToolbar>
);

export const ExamplePage = () => {
    return (
        <Stack topLevelTitle="Products">
            <StackSwitch>
                {/* ### GRID ### */}
                <StackPage name="grid">
                    <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
                    <MainContent fullHeight>
                        <ProductsGrid />
                    </MainContent>
                </StackPage>

                {/* ### EDIT FORM ### */}
                <StackPage name="edit" title="Edit Product">
                    {(selectedProductId) => (
                        <SaveBoundary>
                            {formToolbar}
                            <ProductForm id={selectedProductId} />
                        </SaveBoundary>
                    )}
                </StackPage>

                {/* ### ADD FORM ### */}
                <StackPage name="add" title="Add Product">
                    <SaveBoundary>
                        {formToolbar}
                        <ProductForm />
                    </SaveBoundary>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};
