import { useQuery } from "@apollo/client";
import { muiGridFilterToGql, muiGridSortToGql, StackLink, useBufferedRowCount, useDataGridRemote, usePersistentColumnState } from "@comet/admin";
import { Edit } from "@comet/admin-icons";
import { Box, IconButton } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { GQLProductsListFragment } from "@src/products/ProductsGrid.generated";
import { GQLShopProductsListQuery, GQLShopProductsListQueryVariables } from "@src/shop/dataGrid/ShopProductsDataGrid.generated";
import { ShopProductsToolbar } from "@src/shop/dataGrid/ShopProductsToolbar";
import gql from "graphql-tag";
import React from "react";

export const ShopProductsDataGrid: React.FC = () => {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductsGrid") };
    const sortModel = dataGridProps.sortModel;
    const columns: GridColDef<GQLProductsListFragment>[] = [
        { field: "name", headerName: "Name", width: 150 },
        { field: "description", headerName: "Description", width: 600, flex: 1 },
        {
            field: "action",
            sortable: false,
            filterable: false,
            width: 150,
            resizable: false,
            renderCell: (params) => {
                return (
                    <IconButton component={StackLink} pageName="edit" payload={params.row.id}>
                        <Edit color="primary" />
                    </IconButton>
                );
            },
        },
    ];
    const { data, loading, error } = useQuery<GQLShopProductsListQuery, GQLShopProductsListQueryVariables>(shopProductsQuery, {
        variables: {
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
            offset: dataGridProps.page * dataGridProps.pageSize,
            limit: dataGridProps.pageSize,
            sort: muiGridSortToGql(sortModel),
        },
    });
    const rows = data?.shopProducts.nodes ?? [];
    const rowCount = useBufferedRowCount(data?.shopProducts.totalCount);

    return (
        <Box sx={{ height: 700, width: "100%" }}>
            <DataGridPro
                {...dataGridProps}
                disableSelectionOnClick
                rows={rows}
                rowCount={rowCount}
                columns={columns}
                loading={loading}
                error={error}
                components={{
                    Toolbar: () => {
                        return <ShopProductsToolbar />;
                    },
                }}
            />
        </Box>
    );
};

const shopProductsQuery = gql`
    query ShopProductsList($offset: Int!, $limit: Int!, $sort: [ShopProductSort!], $filter: ShopProductFilter) {
        shopProducts(offset: $offset, limit: $limit, sort: $sort, filter: $filter) {
            totalCount
            nodes {
                id
                name
                description
            }
        }
    }
`;
