import { IStackApi, Toolbar, ToolbarActions, ToolbarFillSpace, ToolbarItem } from "@comet/admin";
import { ArrowLeft } from "@comet/admin-icons";
import { Save } from "@mui/icons-material";
import { Button, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSaveShopProductHandler } from "@src/shop/shopProductPage/SaveShopProductHandler";
import React from "react";
import { FormattedMessage } from "react-intl";

export const ShopProductToolbar: React.FC<{ productName: string; description?: string; stackApi?: IStackApi; saveAllButtonDisabled: boolean }> = ({
    productName,
    description,
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
                <TextWrapper>
                    <Typography variant="subtitle1" fontWeight="bold">
                        <FormattedMessage id="shopProducts.dataGrid.toolbar.title" defaultMessage={productName} />
                    </Typography>
                    <Typography variant="body2">
                        <FormattedMessage id="shopProducts.dataGrid.toolbar.description" defaultMessage={description} />
                    </Typography>
                </TextWrapper>
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

const TextWrapper = styled("div")`
    display: flex;
    flex-direction: column;
`;
