import { Toolbar, ToolbarActions, ToolbarFillSpace, ToolbarItem } from "@comet/admin";
import { Save } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import React from "react";
import { FormattedMessage } from "react-intl";

export const ShopProductToolbar: React.FC<{ productName: string }> = ({ productName }) => {
    return (
        <Toolbar>
            <ToolbarItem>
                <Typography variant="h3">
                    <FormattedMessage id="shopProducts.dataGrid.toolbar.title" defaultMessage={productName} />
                </Typography>
            </ToolbarItem>
            <ToolbarFillSpace />
            <ToolbarActions>
                <Button startIcon={<Save />} variant="contained" color="primary">
                    <FormattedMessage id="shopProductPage.toolbar.save" defaultMessage="Save" />
                </Button>
            </ToolbarActions>
        </Toolbar>
    );
};
