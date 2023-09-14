import { MainContent, Tab, Tabs, useStackApi } from "@comet/admin";
import { SaveShopProductHandlerProvider } from "@src/shop/shopProductPage/SaveShopProductHandler";
import { ShopProductToolbar } from "@src/shop/shopProductPage/ShopProductToolbar";
import { ShopProductCategoriesPage } from "@src/shop/shopProductPage/tabs/shopProductCategories/ShopProductCategoriesPage";
import { ShopProductInformationPage } from "@src/shop/shopProductPage/tabs/shopProductInformation/ShopProductInformationPage";
import { ShopProductVariantsPage } from "@src/shop/shopProductPage/tabs/shopProductVariants/ShopProductVariantsPage";
import * as React from "react";
import { useIntl } from "react-intl";

export const ShopProductPage: React.FunctionComponent<{ shopProductId: string }> = ({ shopProductId }) => {
    const intl = useIntl();
    const stackApi = useStackApi();
    return (
        <SaveShopProductHandlerProvider>
            <ShopProductToolbar productName={shopProductId} stackApi={stackApi} />
            <MainContent>
                <Tabs>
                    <Tab label={intl.formatMessage({ id: "shopProductPage.tab.general", defaultMessage: "General" })}>
                        <ShopProductInformationPage shopProductId={shopProductId} />
                    </Tab>
                    <Tab label={intl.formatMessage({ id: "shopProductPage.tab.categories", defaultMessage: "Categories" })}>
                        <ShopProductCategoriesPage shopProductId={shopProductId} />
                    </Tab>
                    <Tab label={intl.formatMessage({ id: "shopProductPage.tab.variants", defaultMessage: "Variants" })}>
                        <ShopProductVariantsPage shopProductId={shopProductId} />
                    </Tab>
                </Tabs>
            </MainContent>
        </SaveShopProductHandlerProvider>
    );
};
