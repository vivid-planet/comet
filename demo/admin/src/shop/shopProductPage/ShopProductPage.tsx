import { useQuery } from "@apollo/client";
import { MainContent, Tab, Tabs, useStackApi } from "@comet/admin";
import { SaveShopProductHandlerProvider } from "@src/shop/shopProductPage/SaveShopProductHandler";
import { ShopProductToolbar } from "@src/shop/shopProductPage/ShopProductToolbar";
import { ShopProductCategoriesPage } from "@src/shop/shopProductPage/tabs/shopProductCategories/ShopProductCategoriesPage";
import {
    GQLShopProductQuery,
    GQLShopProductQueryVariables,
} from "@src/shop/shopProductPage/tabs/shopProductCategories/ShopProductCategoriesPage.generated";
import { ShopProductInformationPage, shopProductQuery } from "@src/shop/shopProductPage/tabs/shopProductInformation/ShopProductInformationPage";
import { ShopProductVariantsPage } from "@src/shop/shopProductPage/tabs/shopProductVariants/ShopProductVariantsPage";
import * as React from "react";
import { useIntl } from "react-intl";

export const ShopProductPage: React.FunctionComponent<{ shopProductId: string }> = ({ shopProductId }) => {
    const intl = useIntl();
    const stackApi = useStackApi();
    const [saveAllButtonDisabled, setSaveAllButtonDisabled] = React.useState(false);
    const { data: shopProductData } = useQuery<GQLShopProductQuery, GQLShopProductQueryVariables>(shopProductQuery, {
        variables: { id: shopProductId },
        skip: shopProductId === "new",
    });
    return (
        <SaveShopProductHandlerProvider>
            <ShopProductToolbar
                productName={shopProductData?.shopProduct.name || shopProductId}
                description={shopProductData?.shopProduct.description}
                stackApi={stackApi}
                saveAllButtonDisabled={saveAllButtonDisabled}
            />
            <MainContent>
                <Tabs>
                    <Tab label={intl.formatMessage({ id: "shopProductPage.tab.general", defaultMessage: "General" })} forceRender={true}>
                        <ShopProductInformationPage shopProductId={shopProductId} shopProductData={shopProductData} />
                    </Tab>
                    <Tab label={intl.formatMessage({ id: "shopProductPage.tab.categories", defaultMessage: "Categories" })} forceRender={true}>
                        <ShopProductCategoriesPage shopProductId={shopProductId} />
                    </Tab>
                    <Tab label={intl.formatMessage({ id: "shopProductPage.tab.variants", defaultMessage: "Variants" })} forceRender={true}>
                        <ShopProductVariantsPage shopProductId={shopProductId} setSaveAllButtonDisabled={setSaveAllButtonDisabled} />
                    </Tab>
                </Tabs>
            </MainContent>
        </SaveShopProductHandlerProvider>
    );
};
