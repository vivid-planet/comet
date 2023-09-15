import { Stack, StackPage, StackSwitch } from "@comet/admin";
import { ShopProductVariantInformationPage } from "@src/shop/shopProductPage/tabs/shopProductVariants/ShopProductVariantInformationPage";
import { ShopProductVariantsDataGrid } from "@src/shop/shopProductPage/tabs/shopProductVariants/ShopProductVariantsDataGrid";
import React from "react";
import { useIntl } from "react-intl";

export const ShopProductVariantsPage: React.FunctionComponent<{ shopProductId: string }> = ({ shopProductId }) => {
    const intl = useIntl();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "shopProducts.variants", defaultMessage: "Variants" })}>
            <StackSwitch initialPage="table">
                <StackPage name="table">
                    <ShopProductVariantsDataGrid shopProductId={shopProductId} />
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "shopProducts.variants.edit", defaultMessage: "Edit variant" })}>
                    {(selectedId) => <ShopProductVariantInformationPage shopProductVariantId={selectedId} shopProductId={shopProductId} />}
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};
