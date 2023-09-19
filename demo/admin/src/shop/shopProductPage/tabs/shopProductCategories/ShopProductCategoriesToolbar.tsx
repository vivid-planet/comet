import { messages, Toolbar, ToolbarActions, ToolbarFillSpace, ToolbarItem, Tooltip } from "@comet/admin";
import { Filter, Select } from "@comet/admin-icons";
import { Button, Typography } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid";
import React from "react";
import { FormattedMessage } from "react-intl";

interface ShopProductCategoriesToolbarProps {
    setDialogOpen: (open: boolean) => void;
    allowFiltering: boolean;
}

const GridFilterButton: React.FC<{ allowFiltering: boolean }> = ({ allowFiltering }) => {
    const apiRef = useGridApiContext();
    const handleFilterClick = React.useCallback(() => {
        apiRef.current.showFilterPanel();
    }, [apiRef]);
    return (
        <Tooltip
            trigger="hover"
            title={
                <FormattedMessage
                    id="shopProducts.categories.toolbar.filterDisabled"
                    defaultMessage={allowFiltering ? "Filter" : "Filtering is disabled. Please save to enable filtering."}
                />
            }
        >
            <span>
                <Button startIcon={<Filter />} variant="text" color="info" onClick={handleFilterClick} disabled={!allowFiltering}>
                    <FormattedMessage {...messages.filter} />
                </Button>
            </span>
        </Tooltip>
    );
};

export const ShopProductCategoriesToolbar: React.FC<ShopProductCategoriesToolbarProps> = ({ setDialogOpen, allowFiltering }) => {
    return (
        <Toolbar>
            <ToolbarItem>
                <Typography variant="h4">
                    <FormattedMessage id="shopProducts.categories.toolbar.title" defaultMessage="Selected Categories" />
                </Typography>
            </ToolbarItem>
            <ToolbarFillSpace />
            <ToolbarItem>
                <GridFilterButton allowFiltering={allowFiltering} />
            </ToolbarItem>
            <ToolbarActions>
                <Button startIcon={<Select />} onClick={() => setDialogOpen(true)} variant="contained" color="primary">
                    <FormattedMessage id="shopProducts.categories.toolbar.addProduct" defaultMessage="Select" />
                </Button>
            </ToolbarActions>
        </Toolbar>
    );
};
