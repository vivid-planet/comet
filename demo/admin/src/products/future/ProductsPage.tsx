import {
    Button,
    FillSpace,
    MainContent,
    RouterTab,
    RouterTabs,
    SaveBoundary,
    SaveBoundarySaveButton,
    Stack,
    StackLink,
    StackMainContent,
    StackPage,
    StackSwitch,
    StackToolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
} from "@comet/admin";
import { Add as AddIcon, Edit } from "@comet/admin-icons";
import { ContentScopeIndicator } from "@comet/cms-admin";
import { IconButton } from "@mui/material";
import { ProductVariantsGrid } from "@src/products/future/generated/ProductVariantsGrid";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductForm } from "./generated/ProductForm";
import { ProductPriceForm } from "./generated/ProductPriceForm";
import { ProductsGrid } from "./generated/ProductsGrid";

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

export function ProductsPage() {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "products.products", defaultMessage: "Products" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
                    <StackMainContent fullHeight>
                        <ProductsGrid
                            toolbarAction={
                                <Button responsive startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add">
                                    <FormattedMessage id="product.newProduct" defaultMessage="New Product" />
                                </Button>
                            }
                            rowAction={(params) => (
                                <IconButton color="primary" component={StackLink} pageName="edit" payload={params.row.id}>
                                    <Edit />
                                </IconButton>
                            )}
                            actionsColumnWidth={116}
                        />
                    </StackMainContent>
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "products.editProduct", defaultMessage: "Edit Product" })}>
                    {(selectedProductId) => (
                        <SaveBoundary>
                            <>
                                <FormToolbar />
                                <StackMainContent>
                                    <RouterTabs>
                                        <RouterTab
                                            forceRender={true}
                                            path=""
                                            label={intl.formatMessage({ id: "products.product", defaultMessage: "Product" })}
                                        >
                                            <ProductForm id={selectedProductId} />
                                        </RouterTab>
                                        <RouterTab
                                            forceRender={true}
                                            path="/price"
                                            label={intl.formatMessage({ id: "products.price", defaultMessage: "Price" })}
                                        >
                                            <ProductPriceForm id={selectedProductId} />
                                        </RouterTab>
                                    </RouterTabs>
                                </StackMainContent>
                            </>
                        </SaveBoundary>
                    )}
                </StackPage>
                <StackPage
                    name="variants"
                    title={intl.formatMessage({
                        id: "products.editProduct",
                        defaultMessage: "Product variants",
                    })}
                >
                    {(selectedId) => (
                        <>
                            <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
                            <MainContent fullHeight>
                                <ProductVariantsGrid product={selectedId} />
                            </MainContent>
                        </>
                    )}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "products.addProduct", defaultMessage: "Add Product" })}>
                    <SaveBoundary>
                        <FormToolbar />
                        <MainContent>
                            <ProductForm />
                        </MainContent>
                    </SaveBoundary>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}
