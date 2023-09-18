import { IStackApi, Toolbar, ToolbarActions, ToolbarFillSpace, ToolbarItem } from "@comet/admin";
import { ArrowLeft } from "@comet/admin-icons";
import { Save } from "@mui/icons-material";
import { Button, IconButton, Typography } from "@mui/material";
import React from "react";
import { FormattedMessage } from "react-intl";

export const ShopProductVariantToolbar: React.FC<{
    variantName?: string;
    stackApi?: IStackApi;
}> = ({ variantName, stackApi }) => {
    return (
        <Toolbar>
            <ToolbarItem>
                <IconButton onClick={stackApi?.goBack}>
                    <ArrowLeft />
                </IconButton>
                <Typography variant="h3">
                    <FormattedMessage id="shopProducts.variant.toolbar.title" defaultMessage={variantName ? variantName : "New variant"} />
                </Typography>
            </ToolbarItem>
            <ToolbarFillSpace />
            <ToolbarActions>
                <Button startIcon={<Save />} variant="contained" color="primary" type="submit">
                    <FormattedMessage id="shopProducts.variant.toolbar.save" defaultMessage={variantName ? "Save" : "Add"} />
                </Button>
            </ToolbarActions>
        </Toolbar>
    );
};
