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

import ProductTagForm from "./ProductTagForm";
import ProductTagsTable from "./ProductTagTable";

const ProductTagsPage = () => {
    const intl = useIntl();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.productTags", defaultMessage: "Product Tags" })}>
            <StackSwitch initialPage="table">
                <StackPage name="table">
                    <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
                    <MainContent fullHeight>
                        <ProductTagsTable />
                    </MainContent>
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "products.editProductTag", defaultMessage: "Edit product Tag" })}>
                    {(selectedId) => (
                        <SaveBoundary>
                            <StackToolbar scopeIndicator={<ContentScopeIndicator global />}>
                                <ToolbarBackButton />
                                <ToolbarAutomaticTitleItem />
                                <FillSpace />
                                <ToolbarActions>
                                    <SaveBoundarySaveButton />
                                </ToolbarActions>
                            </StackToolbar>
                            <ProductTagForm id={selectedId} />
                        </SaveBoundary>
                    )}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "products.addProductTag", defaultMessage: "Add product Tag" })}>
                    <SaveBoundary>
                        <StackToolbar scopeIndicator={<ContentScopeIndicator global />}>
                            <ToolbarBackButton />
                            <ToolbarAutomaticTitleItem />
                            <FillSpace />
                            <ToolbarActions>
                                <SaveBoundarySaveButton />
                            </ToolbarActions>
                        </StackToolbar>
                        <ProductTagForm />
                    </SaveBoundary>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};

export default ProductTagsPage;
