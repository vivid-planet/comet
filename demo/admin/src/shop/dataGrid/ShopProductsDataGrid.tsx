import { useQuery } from "@apollo/client";
import {
    muiGridFilterToGql,
    muiGridSortToGql,
    StackLink,
    Tooltip,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Edit, Info } from "@comet/admin-icons";
import { Box, IconButton, Typography } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { GQLProductsListFragment } from "@src/products/ProductsGrid.generated";
import { GQLShopProductsListQuery, GQLShopProductsListQueryVariables } from "@src/shop/dataGrid/ShopProductsDataGrid.generated";
import { ShopProductsDataGridToolbar } from "@src/shop/dataGrid/ShopProductsDataGridToolbar";
import gql from "graphql-tag";
import React from "react";
import { FormattedMessage } from "react-intl";

const ShopProductsDataGrid: React.FC = () => {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductsGrid") };
    const sortModel = dataGridProps.sortModel;
    const NameHeader = () => (
        <div style={{ display: "flex", alignItems: "center" }}>
            <Typography fontWeight={400} fontSize={14}>
                Name
            </Typography>
            <Tooltip trigger="click" title={<FormattedMessage id="shopProducts.dataGrid.name" defaultMessage="The title/name of the product" />}>
                <IconButton>
                    <Info />
                </IconButton>
            </Tooltip>
        </div>
    );
    const columns: GridColDef<GQLProductsListFragment>[] = [
        {
            field: "name",
            headerName: "Name",
            width: 150,
            renderHeader: () => <NameHeader />,
        },
        { field: "description", headerName: "Description", width: 600 },
        {
            field: "action",
            headerName: "Actions",
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                return (
                    <>
                        <IconButton component={StackLink} pageName="edit" payload={params.row.id}>
                            <Edit color="primary" />
                        </IconButton>
                    </>
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
        <Box sx={{ height: 400, width: "100%" }}>
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
                        return <ShopProductsDataGridToolbar />;
                    },
                }}
            />
        </Box>
    );
};
export default ShopProductsDataGrid;

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
