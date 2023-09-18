import { IStackApi, Toolbar, ToolbarActions, ToolbarFillSpace, ToolbarItem } from "@comet/admin";
import { ArrowLeft } from "@comet/admin-icons";
import { Save } from "@mui/icons-material";
import { Button, IconButton, Typography } from "@mui/material";
import { useSaveShopProductHandler } from "@src/shop/shopProductPage/SaveShopProductHandler";
import React from "react";
import { FormattedMessage } from "react-intl";

export const ShopProductToolbar: React.FC<{ productName: string; stackApi?: IStackApi; saveAllButtonDisabled: boolean }> = ({
    productName,
    stackApi,
    saveAllButtonDisabled,
}) => {
    const { saveAll } = useSaveShopProductHandler();
    return (
        <Toolbar>
            <ToolbarItem>
                <IconButton onClick={stackApi?.goBack}>
                    <ArrowLeft />
                </IconButton>
                <Typography variant="h3">
                    <FormattedMessage id="shopProducts.dataGrid.toolbar.title" defaultMessage={productName} />
                </Typography>
            </ToolbarItem>
            <ToolbarFillSpace />
            <ToolbarActions>
                <Button startIcon={<Save />} variant="contained" color="primary" onClick={saveAll} disabled={saveAllButtonDisabled}>
                    <FormattedMessage id="shopProductPage.toolbar.save" defaultMessage="Save" />
                </Button>
            </ToolbarActions>
        </Toolbar>
    );
};
