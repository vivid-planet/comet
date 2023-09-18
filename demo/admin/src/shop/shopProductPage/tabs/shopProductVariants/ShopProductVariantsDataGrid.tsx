import { useQuery } from "@apollo/client";
import {
    muiGridFilterToGql,
    StackLink,
    StackSwitchApiContext,
    Toolbar,
    ToolbarActions,
    ToolbarFillSpace,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Add as AddIcon, Edit } from "@comet/admin-icons";
import { Box, Button, IconButton } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { GQLProductsListFragment } from "@src/products/ProductsGrid.generated";
import {
    GQLShopProductQuery,
    GQLShopProductQueryVariables,
} from "@src/shop/shopProductPage/tabs/shopProductVariants/ShopProductVariantsDataGrid.generated";
import gql from "graphql-tag";
import React from "react";
import { FormattedMessage } from "react-intl";

export const ShopProductVariantsDataGrid: React.FC<{ shopProductId: string }> = ({ shopProductId }) => {
    const stackApi = React.useContext(StackSwitchApiContext);
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductVariantsGrid") };
    const columns: GridColDef<GQLProductsListFragment>[] = [
        { field: "name", headerName: "Name", width: 150, flex: 1 },
        { field: "size", headerName: "Size", width: 150 },
        { field: "color", headerName: "Color", width: 150 },
        { field: "price", headerName: "Price", width: 150, type: "number", valueFormatter: (params) => `${params.value} €` },
        {
            field: "action",
            headerName: "Actions",
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                return (
                    <IconButton component={StackLink} pageName="edit" payload={params.row.id}>
                        <Edit color="primary" />
                    </IconButton>
                );
            },
        },
    ];
    const { data, loading, error } = useQuery<GQLShopProductQuery, GQLShopProductQueryVariables>(shopProductVariantsQuery, {
        variables: {
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
            id: shopProductId,
        },
    });
    const rows = data?.shopProduct.variants ?? [];
    const rowCount = useBufferedRowCount(data?.shopProduct.variants.length);

    return (
        <>
            <Toolbar>
                <ToolbarFillSpace />
                <ToolbarActions>
                    <Button startIcon={<AddIcon />} onClick={() => stackApi.activatePage("edit", "new")} variant="contained" color="primary">
                        <FormattedMessage id="shopProduct.variants.dataGrid.toolbar.add" defaultMessage="Add variant" />
                    </Button>
                </ToolbarActions>
            </Toolbar>
            <Box sx={{ height: 700, width: "100%" }}>
                <DataGridPro
                    {...dataGridProps}
                    disableSelectionOnClick
                    rows={rows}
                    rowCount={rowCount}
                    columns={columns}
                    loading={loading}
                    error={error}
                />
            </Box>
        </>
    );
};

const shopProductVariantsQuery = gql`
    query ShopProduct($id: ID!) {
        shopProduct(id: $id) {
            id
            variants {
                id
                name
                size
                color
                price
            }
        }
    }
`;
