import { Stack, StackPage, StackSwitch } from "@comet/admin";
import { ShopProductVariantInformationPage } from "@src/shop/shopProductPage/tabs/shopProductVariants/ShopProductVariantInformationPage";
import { ShopProductVariantsDataGrid } from "@src/shop/shopProductPage/tabs/shopProductVariants/ShopProductVariantsDataGrid";
import React from "react";
import { useIntl } from "react-intl";

export const ShopProductVariantsPage: React.FunctionComponent<{ shopProductId: string; setSaveAllButtonDisabled: (state: boolean) => void }> = ({
    shopProductId,
    setSaveAllButtonDisabled,
}) => {
    const intl = useIntl();
    setSaveAllButtonDisabled(false);
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "shopProducts.variants", defaultMessage: "Variants" })}>
            <StackSwitch initialPage="table">
                <StackPage name="table">
                    <ShopProductVariantsDataGrid shopProductId={shopProductId} />
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "shopProducts.variants.edit", defaultMessage: "Edit variant" })}>
                    {(selectedId) => {
                        setSaveAllButtonDisabled(true);
                        return <ShopProductVariantInformationPage shopProductVariantId={selectedId} shopProductId={shopProductId} />;
                    }}
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};
