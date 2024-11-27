import {
    MainContent,
    SaveBoundary,
    SaveBoundarySaveButton,
    StackToolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
    ToolbarFillSpace,
} from "@comet/admin";
import { ContentScopeIndicator } from "@comet/cms-admin";
import { ProductVariantForm } from "@src/products/future/generated/ProductVariantForm";

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

export function ProductVariantsPage() {
    return (
        <SaveBoundary>
            <FormToolbar />
            <MainContent>
                <ProductVariantForm />
            </MainContent>
        </SaveBoundary>
    );
}
