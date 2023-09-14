import { GridFilterButton, Toolbar, ToolbarActions, ToolbarFillSpace, ToolbarItem } from "@comet/admin";
import { Add as AddIcon } from "@comet/admin-icons";
import { Button, Typography } from "@mui/material";
import React from "react";
import { FormattedMessage } from "react-intl";

export const ShopProductCategoriesToolbar: React.FC<{ setDialogOpen: (open: boolean) => void }> = ({ setDialogOpen }) => {
    return (
        <Toolbar>
            <ToolbarItem>
                <Typography variant="h4">
                    <FormattedMessage id="shopProducts.categories.toolbar.title" defaultMessage="Selected Categories" />
                </Typography>
            </ToolbarItem>
            <ToolbarFillSpace />
            <ToolbarItem>
                <GridFilterButton />
            </ToolbarItem>
            <ToolbarActions>
                <Button startIcon={<AddIcon />} onClick={() => setDialogOpen(true)} variant="contained" color="primary">
                    <FormattedMessage id="shopProducts.categories.toolbar.addProduct" defaultMessage="Select Categories" />
                </Button>
            </ToolbarActions>
        </Toolbar>
    );
};
