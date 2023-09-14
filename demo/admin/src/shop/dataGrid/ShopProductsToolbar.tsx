import { GridFilterButton, StackSwitchApiContext, Toolbar, ToolbarActions, ToolbarFillSpace, ToolbarItem } from "@comet/admin";
import { Add as AddIcon } from "@comet/admin-icons";
import { Button, Typography } from "@mui/material";
import React from "react";
import { FormattedMessage } from "react-intl";

export const ShopProductsToolbar: React.FC = () => {
    const stackApi = React.useContext(StackSwitchApiContext);
    return (
        <Toolbar>
            <ToolbarItem>
                <Typography variant="h3">
                    <FormattedMessage id="shopProducts.dataGrid.toolbar.title" defaultMessage="Shop Products" />
                </Typography>
            </ToolbarItem>
            <ToolbarFillSpace />
            <ToolbarItem>
                <GridFilterButton />
            </ToolbarItem>
            <ToolbarActions>
                <Button startIcon={<AddIcon />} onClick={() => stackApi.activatePage("edit", "new")} variant="contained" color="primary">
                    <FormattedMessage id="shopProducts.dataGrid.toolbar.addProduct" defaultMessage="Add Product" />
                </Button>
            </ToolbarActions>
        </Toolbar>
    );
};
